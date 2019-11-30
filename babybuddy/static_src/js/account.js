
BabyBuddy.Account = function(root) {
  var $ = root.jQuery;
  var _ = root._;
  var Stripe = root.Stripe;
  var stripeCard = null;
  var userId = null,
      accountId = null,
      user = {},
      account = {},
      stripe = null,
      stripeElements = null,
      $el = null,
      $inviteeInput = null,
      usersToAddBeforeIncurringCost = 0,

      // clicking this means to invite the person to account and, potentially increase subscription
      $inviteeBtn = null,

      $inviteeStripeTokenInput = null,
      $inviteeStripeForm = null,

      $subscriptionStripeTokenInput = null,
      $subscriptionService = null,
      $subscriptionStripeForm = null,

      // if acct is premium, then clicking this means downgrade to free acct
      $freeAcctBtn = null,

      // if acct is free, then clicking this means upgrade to premium
      $premiumAcctBtn = null,
      $paymentModal = null,

      stripeStyle = {
        base: {
          // Add your base input styles here. For example:
          fontSize: '16px',
          color: "#32325d",
        }
      },
      self = null;

  var Account = {
    init: function(el, uId, aId, key) {
      self = this;
      userId = uId;
      accountId = aId;
      stripe = Stripe(key);
      stripeElements = stripe.elements();
      $el = $('#' + el);
      
      $inviteeInput = $el.find('#invitee');
      $inviteeBtn = $el.find('#invitee-btn');
      $inviteeStripeForm = $el.find('#invitee-form');
      $inviteeStripeTokenInput = $el.find('#stripe_invitee_token');

      $subscriptionStripeForm = $el.find('#subscription-form');
      $subscriptionStripeTokenInput = $el.find('#stripe_subscription_token');
      $subscriptionService = $el.find('#stripe_subscription_service');
      
      $freeAcctBtn = $el.find('#free-plan-btn');
      $premiumAcctBtn = $el.find('#premium-plan-btn');
      $paymentModal = $el.find('#payment-modal');

      $freeAcctBtn.click(function(evt){
        evt.preventDefault();
        $subscriptionService.val('free');
        $subscriptionStripeForm.submit();
      });

      $inviteeBtn.click(function(evt){
        evt.preventDefault();
        self.inviteAccountMember();
      });

      $premiumAcctBtn.click(function(evt){
        evt.preventDefault();
        self.upgradeToPremium();
      });

      // Create an instance of the card Element.
      stripeCard = stripeElements.create('card', {style: stripeStyle});

      self.fetchAccount(accountId);

      $el.find('#delete-account-btn').click(function(evt){
        evt.preventDefault();
        $el.find('#confirm-delete-account-modal').show();
        $el.find('#confirm-delete-account-btn').click(function(e){
          $el.find('#delete-account-form').submit();
        });
      });

      $el.find('.deactivate-account-user-btn').click(function(evt){
        evt.preventDefault();
        var $form = $(this).parent();
        $el.find('#confirm-deactivate-member-modal').modal('show');
        $el.find('#confirm-deactivate-member-btn').click(function(e){
          $form.submit();
        });
      });

      $el.find('.delete-account-user-btn').click(function(evt){
        evt.preventDefault();
        var $form = $(this).parent();
        $el.find('#confirm-delete-member-modal').modal('show');
        $el.find('#confirm-delete-member-btn').click(function(e){
          $form.submit();
        });
      });
      
    },
    fetchAccount: function(id) {
      return $.get(BabyBuddy.ApiRoutes.account(id)).then(function(response){
        account = response;
        console.log('account', account);
        return response;
      });
    },
    upgradeToPremium: function (){
      $paymentModal.find('#purchase-description').html('Upgrade to premium service');
      
      var $useExistingPaymentSourceSection = $paymentModal.find('#existing-payment-source-section');
      var $useExistingPaymentSourceCB = $paymentModal.find('#use-existing-payment-source');
      var hasPaymentSource = account && account.payment_source && account.payment_source.has_payment_source;
      if (hasPaymentSource) {
        var paymentSource = account.payment_source.payment_source;
        $paymentModal.find('#payment-brand').html(paymentSource.brand);
        $paymentModal.find('#payment-expmo').html(paymentSource.exp_month);
        $paymentModal.find('#payment-expyr').html(paymentSource.exp_year);
        $paymentModal.find('#payment-last4').html(paymentSource.last4);
        $useExistingPaymentSourceCB.click(function(evt) {
          var useExisting = $useExistingPaymentSourceCB.prop('checked');
          if (useExisting) {
            $paymentModal.find('#cc-container').hide();
          } else {
            $paymentModal.find('#cc-container').show();
          }
        });
      } else {
        $useExistingPaymentSourceSection.empty();
      }

      // Add an instance of the card Element into the `card-element` <div>.
      stripeCard.mount('#card-element');
      stripeCard.addEventListener('change', function(e){
        var $displayErrors = $el.find('#card-errors');
        if (e.error) {
          $displayErrors.html(e.error.message);
        } else {
          $displayErrors.html('');
        }
      });

      $paymentModal.modal('show');

      var $paymentBtn = $paymentModal.find('#payment-btn');

      var $promoCode = $paymentModal.find('#promo-code');
      var $promoCodeHelpText = $paymentModal.find('#promo-code-help-text');

      $promoCode.on('input', function(evt){
        var promoCode = $promoCode.val();
        if (promoCode) {
          $paymentBtn.toggleClass('disabled', true);
          $paymentBtn.prop('disabled', true);
          $promoCodeHelpText.html('Click to apply promo code before submitting payment');
        } else {
          $paymentBtn.toggleClass('disabled', false);
          $paymentBtn.prop('disabled', false);
          $promoCodeHelpText.html('');
        }
      });

      $paymentModal.find('#apply-promo-btn').click(function(evt) {
        evt.preventDefault();
        var promoCode = $promoCode.val();
        if (promoCode) {
          console.log('apply promo code ' + promoCode);
          return $.post(BabyBuddy.ApiRoutes.accountApplyPromo(accountId), {promo_code: promoCode}).then(response => {
            $paymentBtn.toggleClass('disabled', false);
            $paymentBtn.prop('disabled', false);
            $promoCodeHelpText.html(response.message);
            if (!response.requires_purchase) {
              root.location.reload(true);
            }
            return response;
          });
        }
      });

      $paymentBtn.click(function(e){
        e.preventDefault();
        $subscriptionService.val('premium');
        if (hasPaymentSource && $useExistingPaymentSourceCB.prop('checked')) {
          $subscriptionStripeForm.submit();
        } else {
          stripe.createToken(stripeCard).then(function(result){
            if (result.error) {
              var $displayErrors = $paymentModal.find('#card-errors');
              $displayErrors.html(result.error.message);
            } else {
              $subscriptionStripeTokenInput.val(result.token.id);
              $subscriptionStripeForm.submit();
            }
          });
        }
      });
    },
    inviteAccountMember: function() {
      var invitee = $inviteeInput.val();
      if (!invitee || !account.subscription || !account.subscription.is_active) {
        return;
      }

      var addForFree = account.subscription.member_count < account.subscription.max_members
      if (addForFree) {
        $inviteeStripeForm.submit();
        return;
      }

      $paymentModal.find('#purchase-description').html('Add account member for an additional $1 per month');
      
      var $useExistingPaymentSourceSection = $paymentModal.find('#existing-payment-source-section');
      var $useExistingPaymentSourceCB = $paymentModal.find('#use-existing-payment-source');
      var hasPaymentSource = account && account.payment_source && account.payment_source.has_payment_source;
      if (hasPaymentSource) {
        var paymentSource = account.payment_source;
        $paymentModal.find('#payment-brand').html(paymentSource.brand);
        $paymentModal.find('#payment-expmo').html(paymentSource.exp_mo);
        $paymentModal.find('#payment-expyr').html(paymentSource.exp_yr);
        $paymentModal.find('#payment-last4').html(paymentSource.last4);
      } else {
        $useExistingPaymentSourceSection.empty();
      }

      // Add an instance of the card Element into the `card-element` <div>.
      stripeCard.mount('#card-element');
      stripeCard.addEventListener('change', function(e){
        var $displayErrors = $paymentModal.find('#card-errors');
        if (e.error) {
          $displayErrors.html(e.error.message);
        } else {
          $displayErrors.html('');
        }
      });

      $paymentModal.modal('show');

      $paymentModal.find('#payment-btn').click(function(e){
        e.preventDefault();
        if (hasPaymentSource && $useExistingPaymentSourceCB.prop('checked')) {
          $inviteeStripeForm.submit();
        } else {
          stripe.createToken(stripeCard).then(function(result){
            if (result.error) {
              var $displayErrors = $el.find('#card-errors');
              $displayErrors.html(result.error.message);
            } else {
              $inviteeStripeTokenInput.val(result.token.id);
              $inviteeStripeForm.submit();
            }
          });
        }
      });
    }
  };

  return Account;
} (window);
