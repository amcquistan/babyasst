--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO babyasst;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO babyasst;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO babyasst;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO babyasst;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO babyasst;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO babyasst;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO babyasst;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO babyasst;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO babyasst;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO babyasst;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO babyasst;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO babyasst;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.authtoken_token OWNER TO babyasst;

--
-- Name: babybuddy_account; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.babybuddy_account (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    payment_processor_id character varying(255),
    owner_id integer NOT NULL,
    approved_terms boolean NOT NULL,
    slug character varying(100) NOT NULL
);


ALTER TABLE public.babybuddy_account OWNER TO babyasst;

--
-- Name: babybuddy_account_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.babybuddy_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.babybuddy_account_id_seq OWNER TO babyasst;

--
-- Name: babybuddy_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.babybuddy_account_id_seq OWNED BY public.babybuddy_account.id;


--
-- Name: babybuddy_account_users; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.babybuddy_account_users (
    id integer NOT NULL,
    account_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.babybuddy_account_users OWNER TO babyasst;

--
-- Name: babybuddy_account_users_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.babybuddy_account_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.babybuddy_account_users_id_seq OWNER TO babyasst;

--
-- Name: babybuddy_account_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.babybuddy_account_users_id_seq OWNED BY public.babybuddy_account_users.id;


--
-- Name: babybuddy_accountmembersettings; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.babybuddy_accountmembersettings (
    id integer NOT NULL,
    phone_notifications_enabled boolean NOT NULL,
    email_notifications_enabled boolean NOT NULL,
    is_payer boolean NOT NULL,
    account_id integer NOT NULL,
    user_id integer NOT NULL,
    is_active boolean NOT NULL
);


ALTER TABLE public.babybuddy_accountmembersettings OWNER TO babyasst;

--
-- Name: babybuddy_accountmembersettings_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.babybuddy_accountmembersettings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.babybuddy_accountmembersettings_id_seq OWNER TO babyasst;

--
-- Name: babybuddy_accountmembersettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.babybuddy_accountmembersettings_id_seq OWNED BY public.babybuddy_accountmembersettings.id;


--
-- Name: babybuddy_accountpromocode; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.babybuddy_accountpromocode (
    id integer NOT NULL,
    applied_on timestamp with time zone NOT NULL,
    account_id integer NOT NULL,
    promo_code_id integer NOT NULL
);


ALTER TABLE public.babybuddy_accountpromocode OWNER TO babyasst;

--
-- Name: babybuddy_accountpromocode_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.babybuddy_accountpromocode_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.babybuddy_accountpromocode_id_seq OWNER TO babyasst;

--
-- Name: babybuddy_accountpromocode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.babybuddy_accountpromocode_id_seq OWNED BY public.babybuddy_accountpromocode.id;


--
-- Name: babybuddy_promocode; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.babybuddy_promocode (
    id integer NOT NULL,
    code character varying(100) NOT NULL,
    max_usage integer NOT NULL,
    months_valid integer NOT NULL,
    apply_premium boolean NOT NULL,
    apply_additional_member boolean NOT NULL,
    apply_additional_child boolean NOT NULL,
    max_usage_per_account integer NOT NULL,
    stripe boolean NOT NULL,
    promo_price numeric(7,2) NOT NULL
);


ALTER TABLE public.babybuddy_promocode OWNER TO babyasst;

--
-- Name: babybuddy_promocode_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.babybuddy_promocode_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.babybuddy_promocode_id_seq OWNER TO babyasst;

--
-- Name: babybuddy_promocode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.babybuddy_promocode_id_seq OWNED BY public.babybuddy_promocode.id;


--
-- Name: babybuddy_settings; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.babybuddy_settings (
    id integer NOT NULL,
    dashboard_refresh_rate interval,
    user_id integer NOT NULL,
    language character varying(255) NOT NULL,
    phone_number character varying(100)
);


ALTER TABLE public.babybuddy_settings OWNER TO babyasst;

--
-- Name: babybuddy_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.babybuddy_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.babybuddy_settings_id_seq OWNER TO babyasst;

--
-- Name: babybuddy_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.babybuddy_settings_id_seq OWNED BY public.babybuddy_settings.id;


--
-- Name: core_bath; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_bath (
    id integer NOT NULL,
    "time" timestamp with time zone NOT NULL,
    child_id integer NOT NULL
);


ALTER TABLE public.core_bath OWNER TO babyasst;

--
-- Name: core_bath_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_bath_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_bath_id_seq OWNER TO babyasst;

--
-- Name: core_bath_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_bath_id_seq OWNED BY public.core_bath.id;


--
-- Name: core_child; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_child (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    birth_date date NOT NULL,
    slug character varying(100) NOT NULL,
    picture character varying(100),
    account_id integer,
    is_active boolean NOT NULL
);


ALTER TABLE public.core_child OWNER TO babyasst;

--
-- Name: core_child_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_child_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_child_id_seq OWNER TO babyasst;

--
-- Name: core_child_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_child_id_seq OWNED BY public.core_child.id;


--
-- Name: core_diaperchange; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_diaperchange (
    id integer NOT NULL,
    "time" timestamp with time zone NOT NULL,
    wet boolean NOT NULL,
    solid boolean NOT NULL,
    color character varying(255) NOT NULL,
    child_id integer NOT NULL
);


ALTER TABLE public.core_diaperchange OWNER TO babyasst;

--
-- Name: core_diaperchange_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_diaperchange_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_diaperchange_id_seq OWNER TO babyasst;

--
-- Name: core_diaperchange_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_diaperchange_id_seq OWNED BY public.core_diaperchange.id;


--
-- Name: core_feeding; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_feeding (
    id integer NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    duration interval,
    type character varying(255) NOT NULL,
    method character varying(255) NOT NULL,
    amount double precision,
    child_id integer NOT NULL,
    units character varying(20) NOT NULL
);


ALTER TABLE public.core_feeding OWNER TO babyasst;

--
-- Name: core_feeding_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_feeding_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_feeding_id_seq OWNER TO babyasst;

--
-- Name: core_feeding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_feeding_id_seq OWNED BY public.core_feeding.id;


--
-- Name: core_note; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_note (
    id integer NOT NULL,
    note text NOT NULL,
    "time" timestamp with time zone NOT NULL,
    child_id integer NOT NULL
);


ALTER TABLE public.core_note OWNER TO babyasst;

--
-- Name: core_note_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_note_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_note_id_seq OWNER TO babyasst;

--
-- Name: core_note_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_note_id_seq OWNED BY public.core_note.id;


--
-- Name: core_notification; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_notification (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    url character varying(255),
    frequency_hours integer NOT NULL,
    intervals integer NOT NULL,
    active boolean NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone,
    account_id integer NOT NULL,
    user_id integer NOT NULL,
    child_id integer
);


ALTER TABLE public.core_notification OWNER TO babyasst;

--
-- Name: core_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_notification_id_seq OWNER TO babyasst;

--
-- Name: core_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_notification_id_seq OWNED BY public.core_notification.id;


--
-- Name: core_notificationevent; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_notificationevent (
    id integer NOT NULL,
    acknowledged boolean NOT NULL,
    acknowledged_type character varying(255) NOT NULL,
    url character varying(255),
    notification_id integer NOT NULL,
    user_id integer NOT NULL,
    send_at timestamp with time zone NOT NULL,
    sent boolean NOT NULL
);


ALTER TABLE public.core_notificationevent OWNER TO babyasst;

--
-- Name: core_notificationevent_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_notificationevent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_notificationevent_id_seq OWNER TO babyasst;

--
-- Name: core_notificationevent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_notificationevent_id_seq OWNED BY public.core_notificationevent.id;


--
-- Name: core_sleep; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_sleep (
    id integer NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    duration interval,
    child_id integer NOT NULL
);


ALTER TABLE public.core_sleep OWNER TO babyasst;

--
-- Name: core_sleep_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_sleep_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_sleep_id_seq OWNER TO babyasst;

--
-- Name: core_sleep_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_sleep_id_seq OWNED BY public.core_sleep.id;


--
-- Name: core_suggestion; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_suggestion (
    id integer NOT NULL,
    diaper_change boolean NOT NULL,
    feeding boolean NOT NULL,
    sleep boolean NOT NULL,
    temperature_check boolean NOT NULL,
    tummy_time boolean NOT NULL,
    quantity numeric(6,2),
    units character varying(20),
    send_text_notification boolean NOT NULL,
    send_email_notification boolean NOT NULL,
    send_app_notification boolean NOT NULL,
    send_at timestamp with time zone,
    sent boolean NOT NULL,
    child_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.core_suggestion OWNER TO babyasst;

--
-- Name: core_suggestion_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_suggestion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_suggestion_id_seq OWNER TO babyasst;

--
-- Name: core_suggestion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_suggestion_id_seq OWNED BY public.core_suggestion.id;


--
-- Name: core_temperature; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_temperature (
    id integer NOT NULL,
    temperature double precision NOT NULL,
    "time" timestamp with time zone NOT NULL,
    child_id integer NOT NULL
);


ALTER TABLE public.core_temperature OWNER TO babyasst;

--
-- Name: core_temperature_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_temperature_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_temperature_id_seq OWNER TO babyasst;

--
-- Name: core_temperature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_temperature_id_seq OWNED BY public.core_temperature.id;


--
-- Name: core_timer; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_timer (
    id integer NOT NULL,
    name character varying(255),
    start timestamp with time zone,
    "end" timestamp with time zone,
    duration interval,
    active boolean NOT NULL,
    user_id integer NOT NULL,
    account_id integer,
    child_id integer,
    is_feeding boolean NOT NULL,
    is_sleeping boolean NOT NULL,
    is_tummytime boolean NOT NULL,
    complete boolean NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.core_timer OWNER TO babyasst;

--
-- Name: core_timer_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_timer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_timer_id_seq OWNER TO babyasst;

--
-- Name: core_timer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_timer_id_seq OWNED BY public.core_timer.id;


--
-- Name: core_tummytime; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_tummytime (
    id integer NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    duration interval,
    milestone character varying(255) NOT NULL,
    child_id integer NOT NULL
);


ALTER TABLE public.core_tummytime OWNER TO babyasst;

--
-- Name: core_tummytime_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_tummytime_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_tummytime_id_seq OWNER TO babyasst;

--
-- Name: core_tummytime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_tummytime_id_seq OWNED BY public.core_tummytime.id;


--
-- Name: core_weight; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.core_weight (
    id integer NOT NULL,
    weight double precision NOT NULL,
    date date NOT NULL,
    child_id integer NOT NULL,
    units character varying(20) NOT NULL
);


ALTER TABLE public.core_weight OWNER TO babyasst;

--
-- Name: core_weight_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.core_weight_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.core_weight_id_seq OWNER TO babyasst;

--
-- Name: core_weight_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.core_weight_id_seq OWNED BY public.core_weight.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO babyasst;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO babyasst;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO babyasst;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO babyasst;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO babyasst;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO babyasst;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO babyasst;

--
-- Name: easy_thumbnails_source; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.easy_thumbnails_source (
    id integer NOT NULL,
    storage_hash character varying(40) NOT NULL,
    name character varying(255) NOT NULL,
    modified timestamp with time zone NOT NULL
);


ALTER TABLE public.easy_thumbnails_source OWNER TO babyasst;

--
-- Name: easy_thumbnails_source_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.easy_thumbnails_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.easy_thumbnails_source_id_seq OWNER TO babyasst;

--
-- Name: easy_thumbnails_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.easy_thumbnails_source_id_seq OWNED BY public.easy_thumbnails_source.id;


--
-- Name: easy_thumbnails_thumbnail; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.easy_thumbnails_thumbnail (
    id integer NOT NULL,
    storage_hash character varying(40) NOT NULL,
    name character varying(255) NOT NULL,
    modified timestamp with time zone NOT NULL,
    source_id integer NOT NULL
);


ALTER TABLE public.easy_thumbnails_thumbnail OWNER TO babyasst;

--
-- Name: easy_thumbnails_thumbnail_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.easy_thumbnails_thumbnail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.easy_thumbnails_thumbnail_id_seq OWNER TO babyasst;

--
-- Name: easy_thumbnails_thumbnail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.easy_thumbnails_thumbnail_id_seq OWNED BY public.easy_thumbnails_thumbnail.id;


--
-- Name: easy_thumbnails_thumbnaildimensions; Type: TABLE; Schema: public; Owner: babyasst
--

CREATE TABLE public.easy_thumbnails_thumbnaildimensions (
    id integer NOT NULL,
    thumbnail_id integer NOT NULL,
    width integer,
    height integer,
    CONSTRAINT easy_thumbnails_thumbnaildimensions_height_check CHECK ((height >= 0)),
    CONSTRAINT easy_thumbnails_thumbnaildimensions_width_check CHECK ((width >= 0))
);


ALTER TABLE public.easy_thumbnails_thumbnaildimensions OWNER TO babyasst;

--
-- Name: easy_thumbnails_thumbnaildimensions_id_seq; Type: SEQUENCE; Schema: public; Owner: babyasst
--

CREATE SEQUENCE public.easy_thumbnails_thumbnaildimensions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.easy_thumbnails_thumbnaildimensions_id_seq OWNER TO babyasst;

--
-- Name: easy_thumbnails_thumbnaildimensions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: babyasst
--

ALTER SEQUENCE public.easy_thumbnails_thumbnaildimensions_id_seq OWNED BY public.easy_thumbnails_thumbnaildimensions.id;


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: babybuddy_account id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account ALTER COLUMN id SET DEFAULT nextval('public.babybuddy_account_id_seq'::regclass);


--
-- Name: babybuddy_account_users id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account_users ALTER COLUMN id SET DEFAULT nextval('public.babybuddy_account_users_id_seq'::regclass);


--
-- Name: babybuddy_accountmembersettings id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountmembersettings ALTER COLUMN id SET DEFAULT nextval('public.babybuddy_accountmembersettings_id_seq'::regclass);


--
-- Name: babybuddy_accountpromocode id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountpromocode ALTER COLUMN id SET DEFAULT nextval('public.babybuddy_accountpromocode_id_seq'::regclass);


--
-- Name: babybuddy_promocode id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_promocode ALTER COLUMN id SET DEFAULT nextval('public.babybuddy_promocode_id_seq'::regclass);


--
-- Name: babybuddy_settings id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_settings ALTER COLUMN id SET DEFAULT nextval('public.babybuddy_settings_id_seq'::regclass);


--
-- Name: core_bath id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_bath ALTER COLUMN id SET DEFAULT nextval('public.core_bath_id_seq'::regclass);


--
-- Name: core_child id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_child ALTER COLUMN id SET DEFAULT nextval('public.core_child_id_seq'::regclass);


--
-- Name: core_diaperchange id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_diaperchange ALTER COLUMN id SET DEFAULT nextval('public.core_diaperchange_id_seq'::regclass);


--
-- Name: core_feeding id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_feeding ALTER COLUMN id SET DEFAULT nextval('public.core_feeding_id_seq'::regclass);


--
-- Name: core_note id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_note ALTER COLUMN id SET DEFAULT nextval('public.core_note_id_seq'::regclass);


--
-- Name: core_notification id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notification ALTER COLUMN id SET DEFAULT nextval('public.core_notification_id_seq'::regclass);


--
-- Name: core_notificationevent id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notificationevent ALTER COLUMN id SET DEFAULT nextval('public.core_notificationevent_id_seq'::regclass);


--
-- Name: core_sleep id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_sleep ALTER COLUMN id SET DEFAULT nextval('public.core_sleep_id_seq'::regclass);


--
-- Name: core_suggestion id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_suggestion ALTER COLUMN id SET DEFAULT nextval('public.core_suggestion_id_seq'::regclass);


--
-- Name: core_temperature id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_temperature ALTER COLUMN id SET DEFAULT nextval('public.core_temperature_id_seq'::regclass);


--
-- Name: core_timer id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_timer ALTER COLUMN id SET DEFAULT nextval('public.core_timer_id_seq'::regclass);


--
-- Name: core_tummytime id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_tummytime ALTER COLUMN id SET DEFAULT nextval('public.core_tummytime_id_seq'::regclass);


--
-- Name: core_weight id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_weight ALTER COLUMN id SET DEFAULT nextval('public.core_weight_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: easy_thumbnails_source id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_source ALTER COLUMN id SET DEFAULT nextval('public.easy_thumbnails_source_id_seq'::regclass);


--
-- Name: easy_thumbnails_thumbnail id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnail ALTER COLUMN id SET DEFAULT nextval('public.easy_thumbnails_thumbnail_id_seq'::regclass);


--
-- Name: easy_thumbnails_thumbnaildimensions id; Type: DEFAULT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnaildimensions ALTER COLUMN id SET DEFAULT nextval('public.easy_thumbnails_thumbnaildimensions_id_seq'::regclass);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add settings	1	add_settings
2	Can change settings	1	change_settings
3	Can delete settings	1	delete_settings
4	Can view settings	1	view_settings
5	Can view Account	2	view_account
6	Can add Account	2	add_account
7	Can change Account	2	change_account
8	Can delete Account	2	delete_account
9	Can view Account Member Settings	3	view_accountmembersettings
10	Can add Account Member Settings	3	add_accountmembersettings
11	Can change Account Member Settings	3	change_accountmembersettings
12	Can delete Account Member Settings	3	delete_accountmembersettings
13	Can view Child	4	view_child
14	Can add Child	4	add_child
15	Can change Child	4	change_child
16	Can delete Child	4	delete_child
17	Can view Diaper Change	5	view_diaperchange
18	Can add Diaper Change	5	add_diaperchange
19	Can change Diaper Change	5	change_diaperchange
20	Can delete Diaper Change	5	delete_diaperchange
21	Can view Feeding	6	view_feeding
22	Can add Feeding	6	add_feeding
23	Can change Feeding	6	change_feeding
24	Can delete Feeding	6	delete_feeding
25	Can view Note	7	view_note
26	Can add Note	7	add_note
27	Can change Note	7	change_note
28	Can delete Note	7	delete_note
29	Can view Sleep	8	view_sleep
30	Can add Sleep	8	add_sleep
31	Can change Sleep	8	change_sleep
32	Can delete Sleep	8	delete_sleep
33	Can view Timer	9	view_timer
34	Can add Timer	9	add_timer
35	Can change Timer	9	change_timer
36	Can delete Timer	9	delete_timer
37	Can view Tummy Time	10	view_tummytime
38	Can add Tummy Time	10	add_tummytime
39	Can change Tummy Time	10	change_tummytime
40	Can delete Tummy Time	10	delete_tummytime
41	Can view Weight	11	view_weight
42	Can add Weight	11	add_weight
43	Can change Weight	11	change_weight
44	Can delete Weight	11	delete_weight
45	Can view Temperature	12	view_temperature
46	Can add Temperature	12	add_temperature
47	Can change Temperature	12	change_temperature
48	Can delete Temperature	12	delete_temperature
49	Can add Notification	13	add_notification
50	Can change Notification	13	change_notification
51	Can delete Notification	13	delete_notification
52	Can view Notification	13	view_notification
53	Can add notification event	14	add_notificationevent
54	Can change notification event	14	change_notificationevent
55	Can delete notification event	14	delete_notificationevent
56	Can view notification event	14	view_notificationevent
57	Can add suggestion	15	add_suggestion
58	Can change suggestion	15	change_suggestion
59	Can delete suggestion	15	delete_suggestion
60	Can view suggestion	15	view_suggestion
61	Can add Token	16	add_token
62	Can change Token	16	change_token
63	Can delete Token	16	delete_token
64	Can view Token	16	view_token
65	Can add source	17	add_source
66	Can change source	17	change_source
67	Can delete source	17	delete_source
68	Can view source	17	view_source
69	Can add thumbnail	18	add_thumbnail
70	Can change thumbnail	18	change_thumbnail
71	Can delete thumbnail	18	delete_thumbnail
72	Can view thumbnail	18	view_thumbnail
73	Can add thumbnail dimensions	19	add_thumbnaildimensions
74	Can change thumbnail dimensions	19	change_thumbnaildimensions
75	Can delete thumbnail dimensions	19	delete_thumbnaildimensions
76	Can view thumbnail dimensions	19	view_thumbnaildimensions
77	Can add log entry	20	add_logentry
78	Can change log entry	20	change_logentry
79	Can delete log entry	20	delete_logentry
80	Can view log entry	20	view_logentry
81	Can add permission	21	add_permission
82	Can change permission	21	change_permission
83	Can delete permission	21	delete_permission
84	Can view permission	21	view_permission
85	Can add group	22	add_group
86	Can change group	22	change_group
87	Can delete group	22	delete_group
88	Can view group	22	view_group
89	Can add user	23	add_user
90	Can change user	23	change_user
91	Can delete user	23	delete_user
92	Can view user	23	view_user
93	Can add content type	24	add_contenttype
94	Can change content type	24	change_contenttype
95	Can delete content type	24	delete_contenttype
96	Can view content type	24	view_contenttype
97	Can add session	25	add_session
98	Can change session	25	change_session
99	Can delete session	25	delete_session
100	Can view session	25	view_session
101	Can add promo code	26	add_promocode
102	Can change promo code	26	change_promocode
103	Can delete promo code	26	delete_promocode
104	Can view promo code	26	view_promocode
105	Can add account promo code	27	add_accountpromocode
106	Can change account promo code	27	change_accountpromocode
107	Can delete account promo code	27	delete_accountpromocode
108	Can view account promo code	27	view_accountpromocode
109	Can add Bath	28	add_bath
110	Can change Bath	28	change_bath
111	Can delete Bath	28	delete_bath
112	Can view Bath	28	view_bath
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
5	pbkdf2_sha256$150000$pUgRk3kUXF1X$wOoGQR/vGWYst6Q+QHLsR1/QL1wl/IdQZF8g851dpkI=	2019-11-27 16:51:16.738037+00	f	Tledmonds98@gmail.com	Taylor	Edmonds	Tledmonds98@gmail.com	f	t	2019-11-08 16:05:23.927731+00
1	pbkdf2_sha256$150000$NvSLpsmbrVup$W/hUmbmjEr5DkwBULgWFmelJomLXnMbK691hQIOhiqE=	2019-12-06 18:42:20.822421+00	t	baadmin				t	t	2019-11-03 03:22:37+00
2	pbkdf2_sha256$150000$0StTtwXdnQXz$maILLjwb5wmO3FikjJbJ/ORXNdDnpLo9FUvTQ37d7r4=	2019-11-04 00:18:16+00	f	amcquistan	Adam	McQuistan	orig.sci.guy.mcq@gmail.com	f	t	2019-11-03 22:20:12+00
6	pbkdf2_sha256$150000$t51VkYakGwas$ffyK3RK2O1wa/BZhyApTT3gMP/RkvvQDBYYf2MzSv9I=	2019-12-06 19:04:39.316085+00	f	demouser	demo	user	sci.guy.mcq@gmail.com	f	t	2019-12-06 19:02:48.068822+00
7	pbkdf2_sha256$150000$X7ds56B6VfA4$jLBvewNknetFe7GHIfmSnBNolrcEg/wK4XNm3LCqBEo=	2019-12-06 19:08:42+00	f	adam.mcquistan@thecodinginterface.com	adam	codingguy	demo@mail.com	f	t	2019-12-06 19:06:17+00
4	pbkdf2_sha256$150000$YLrVGgtUxkRa$4WLhkacYcp3+tzoW+9xkSWW+UD6fa4JgjC5/yqTH86A=	2019-12-08 06:17:52.50818+00	f	kfeerhusen@hotmail.com	Kristin	McQuistan	kfeerhusen@hotmail.com	f	t	2019-11-07 00:31:21.001981+00
3	pbkdf2_sha256$150000$TDS3pPwLXYyr$TcLYCY0ZIfT+KQ8RkpJqzWhoQrvUwj61FtPaOkDG4XI=	2019-12-09 06:10:14.026333+00	f	mcquistan	Adam	McQuistan	adam.mcquistan@thecodinginterface.com	f	t	2019-11-04 18:45:20+00
8	pbkdf2_sha256$150000$zfZJLTi4OuzN$mSkp2aQvEJC86o3qYvDHgY835WR/ctqgO25Og9u5XUA=	2019-12-09 13:39:58.695181+00	f	scottwrobinson	Scott	Robinson	s.w.robinson@gmail.com	f	t	2019-12-09 13:39:58.449227+00
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
\.


--
-- Data for Name: babybuddy_account; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.babybuddy_account (id, name, payment_processor_id, owner_id, approved_terms, slug) FROM stdin;
1	admin	\N	1	f	admin
2	McQuistan	\N	2	t	mcquistan
6	user	\N	6	t	user
7	adam.mcquistan@thecodinginterface.com	\N	7	t	adammcquistanthecodinginterfacecom
4	kfeerhusen@hotmail.com	\N	4	t	kfeerhusenhotmailcom
3	McQuistan	cus_G8EpxgdLymfMRM	3	t	mcquistan-1
8	Robinson	\N	8	t	robinson
5	Tledmonds98@gmail.com	\N	5	t	tledmonds98gmailcom
\.


--
-- Data for Name: babybuddy_account_users; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.babybuddy_account_users (id, account_id, user_id) FROM stdin;
1	1	1
2	2	2
3	3	3
4	4	4
5	3	4
6	5	5
7	3	5
8	6	6
9	7	7
10	6	7
11	8	8
\.


--
-- Data for Name: babybuddy_accountmembersettings; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.babybuddy_accountmembersettings (id, phone_notifications_enabled, email_notifications_enabled, is_payer, account_id, user_id, is_active) FROM stdin;
1	f	f	f	1	1	t
2	t	f	f	2	2	t
3	f	f	f	3	3	t
4	f	f	f	4	4	t
5	f	f	f	3	4	t
6	f	f	f	5	5	t
7	f	t	f	3	5	t
8	f	f	f	3	5	t
9	f	f	f	6	6	t
10	f	f	f	7	7	t
11	f	f	f	6	7	t
12	f	f	f	8	8	t
\.


--
-- Data for Name: babybuddy_accountpromocode; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.babybuddy_accountpromocode (id, applied_on, account_id, promo_code_id) FROM stdin;
1	2019-12-06 19:05:37.329517+00	6	2
2	2019-12-09 13:43:53.276152+00	8	2
\.


--
-- Data for Name: babybuddy_promocode; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.babybuddy_promocode (id, code, max_usage, months_valid, apply_premium, apply_additional_member, apply_additional_child, max_usage_per_account, stripe, promo_price) FROM stdin;
1	easierparenting12	5	12	t	f	f	1	f	0.00
2	betaparents6	12	6	t	f	f	1	f	0.00
\.


--
-- Data for Name: babybuddy_settings; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.babybuddy_settings (id, dashboard_refresh_rate, user_id, language, phone_number) FROM stdin;
1	00:01:00	1	en	\N
2	00:01:00	2	en	+14024193571
6	00:01:00	6	en	\N
7	00:01:00	7	en	
4	00:01:00	4	en	+14024505131
3	00:01:00	3	en	\N
8	00:01:00	8	en	\N
5	00:01:00	5	en	
\.


--
-- Data for Name: core_bath; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_bath (id, "time", child_id) FROM stdin;
1	2019-12-04 06:00:00+00	2
2	2019-12-07 06:00:00+00	2
3	2019-12-09 06:00:00+00	2
\.


--
-- Data for Name: core_child; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_child (id, first_name, last_name, birth_date, slug, picture, account_id, is_active) FROM stdin;
1	Kallin	McQuistan	2016-09-09	mcquistan-kallin		2	t
2	Cameron	McQuistan	2019-11-04	mcquistan-cameron		3	t
3	demo	baby	2019-12-01	baby-demo		6	t
4	Maisie	Robinson	2019-06-13	robinson-maisie		8	t
\.


--
-- Data for Name: core_diaperchange; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_diaperchange (id, "time", wet, solid, color, child_id) FROM stdin;
1	2019-11-04 20:00:00+00	f	t	black	2
2	2019-11-04 23:20:00+00	f	t	black	2
3	2019-11-05 00:30:00+00	t	f		2
4	2019-11-07 22:39:00+00	t	t	yellow	2
5	2019-11-08 00:36:00+00	t	f	yellow	2
6	2019-11-08 03:02:00+00	t	f	yellow	2
7	2019-11-08 07:00:00+00	t	f	yellow	2
8	2019-11-08 07:28:00+00	f	t	yellow	2
9	2019-11-08 14:30:00+00	t	f	yellow	2
10	2019-11-08 15:02:00+00	f	t	yellow	2
11	2019-11-08 17:30:00+00	t	f		2
12	2019-11-08 18:32:00+00	t	f		2
13	2019-11-08 21:10:00+00	t	t	yellow	2
14	2019-11-09 03:02:00+00	t	t	yellow	2
15	2019-11-09 06:01:00+00	t	f	yellow	2
16	2019-11-09 07:30:00+00	t	t	yellow	2
17	2019-11-09 12:25:00+00	t	t		2
18	2019-11-09 12:26:00+00	t	t	yellow	2
19	2019-11-09 13:27:00+00	f	t	yellow	2
20	2019-11-09 15:52:00+00	t	t	yellow	2
21	2019-11-09 22:02:00+00	t	t	yellow	2
22	2019-11-10 00:56:00+00	t	t	yellow	2
23	2019-11-10 08:16:00+00	t	f	yellow	2
24	2019-11-10 12:27:00+00	t	f	yellow	2
25	2019-11-10 14:40:00+00	t	f	yellow	2
26	2019-11-10 18:24:00+00	t	t	yellow	2
27	2019-11-10 21:05:00+00	t	f	yellow	2
28	2019-11-10 22:18:00+00	t	f	yellow	2
29	2019-11-10 23:15:00+00	f	t	yellow	2
30	2019-11-11 01:00:00+00	t	f	yellow	2
31	2019-11-11 02:35:00+00	t	f	yellow	2
32	2019-11-11 05:59:00+00	t	t	yellow	2
33	2019-11-11 06:20:00+00	t	f	yellow	2
34	2019-11-11 10:59:00+00	t	f	yellow	2
35	2019-11-11 15:00:00+00	t	f	yellow	2
36	2019-11-11 18:28:00+00	t	t	yellow	2
37	2019-11-11 18:49:00+00	f	t	yellow	2
38	2019-11-11 19:13:00+00	f	t	yellow	2
39	2019-11-11 22:19:00+00	t	t	yellow	2
40	2019-11-11 23:09:00+00	t	t	yellow	2
41	2019-11-12 00:50:00+00	t	t	yellow	2
42	2019-11-12 04:56:00+00	t	f	yellow	2
43	2019-11-12 07:39:00+00	t	f	yellow	2
44	2019-11-12 11:32:00+00	t	f	yellow	2
45	2019-11-12 12:10:00+00	t	f	yellow	2
46	2019-11-12 14:39:00+00	t	f	yellow	2
47	2019-11-12 17:06:00+00	t	t	yellow	2
48	2019-11-12 20:23:00+00	t	t	yellow	2
49	2019-11-12 23:17:00+00	f	t	yellow	2
50	2019-11-12 23:47:00+00	t	f	yellow	2
51	2019-11-13 03:18:00+00	t	f	yellow	2
52	2019-11-13 03:45:00+00	t	f	yellow	2
53	2019-11-13 07:03:00+00	t	f	yellow	2
54	2019-11-13 13:26:00+00	t	f	yellow	2
55	2019-11-13 19:24:00+00	t	f	yellow	2
56	2019-11-13 23:10:00+00	t	f	yellow	2
57	2019-11-14 02:00:00+00	t	f	yellow	2
58	2019-11-14 04:15:00+00	t	t	yellow	2
59	2019-11-14 07:32:00+00	t	f	yellow	2
60	2019-11-14 08:20:00+00	t	t	yellow	2
61	2019-11-14 12:08:00+00	t	f	yellow	2
62	2019-11-14 12:41:00+00	t	t	yellow	2
63	2019-11-13 16:44:00+00	t	t	yellow	2
64	2019-11-14 14:33:00+00	t	f	yellow	2
65	2019-11-14 22:20:00+00	t	t	yellow	2
66	2019-11-14 22:53:00+00	t	t	yellow	2
67	2019-11-15 02:56:00+00	t	f	yellow	2
68	2019-11-15 09:53:00+00	t	t	yellow	2
69	2019-11-15 13:49:00+00	t	f	yellow	2
70	2019-11-15 14:25:00+00	t	t	yellow	2
71	2019-11-15 17:08:00+00	t	t	yellow	2
72	2019-11-15 19:50:00+00	t	f	yellow	2
73	2019-11-15 20:13:00+00	t	f	yellow	2
74	2019-11-15 23:24:00+00	t	f	yellow	2
75	2019-11-16 04:29:00+00	t	f	yellow	2
76	2019-11-16 07:16:00+00	t	f	yellow	2
77	2019-11-16 10:39:00+00	t	f	yellow	2
78	2019-11-16 14:49:00+00	f	t	green	2
79	2019-11-16 15:27:00+00	t	t	green	2
80	2019-11-16 19:37:00+00	t	f	yellow	2
81	2019-11-16 23:30:00+00	t	f	yellow	2
82	2019-11-17 02:03:00+00	t	f	yellow	2
83	2019-11-17 08:38:00+00	t	f	yellow	2
84	2019-11-17 11:25:00+00	t	f	yellow	2
85	2019-11-17 17:51:00+00	t	t	green	2
86	2019-11-18 00:25:00+00	t	f	yellow	2
87	2019-11-18 03:17:00+00	f	t	green	2
88	2019-11-18 04:30:00+00	t	f	yellow	2
89	2019-11-18 07:45:00+00	t	f	yellow	2
90	2019-11-18 10:46:00+00	t	f	yellow	2
91	2019-11-18 11:08:00+00	t	f	yellow	2
92	2019-11-18 16:07:00+00	f	t	green	2
93	2019-11-18 16:26:00+00	t	t	green	2
94	2019-11-18 18:52:00+00	t	f	yellow	2
95	2019-11-18 22:23:00+00	t	f	yellow	2
96	2019-11-18 23:45:00+00	t	f	yellow	2
97	2019-11-19 02:00:00+00	t	f	yellow	2
98	2019-11-19 03:55:00+00	t	f	yellow	2
99	2019-11-19 13:12:00+00	t	f	yellow	2
100	2019-11-19 16:11:00+00	t	f	yellow	2
101	2019-11-19 18:58:00+00	t	t	green	2
102	2019-11-20 00:30:00+00	t	f	yellow	2
103	2019-11-20 01:38:00+00	t	f	yellow	2
104	2019-11-20 03:00:00+00	t	f	yellow	2
105	2019-11-20 04:51:00+00	t	f	yellow	2
106	2019-11-20 06:18:00+00	t	f	yellow	2
107	2019-11-20 10:56:00+00	t	f	yellow	2
108	2019-11-20 16:40:00+00	t	f	yellow	2
109	2019-11-20 20:14:00+00	t	f	yellow	2
110	2019-11-20 21:18:00+00	t	f	yellow	2
111	2019-11-20 23:13:00+00	f	t	green	2
112	2019-11-21 00:10:00+00	f	t	green	2
113	2019-11-21 03:30:00+00	t	f	yellow	2
114	2019-11-21 16:42:00+00	t	f	yellow	2
115	2019-11-21 18:02:00+00	t	f	yellow	2
116	2019-11-21 19:09:00+00	t	f	yellow	2
117	2019-11-21 20:45:00+00	t	f	yellow	2
118	2019-11-21 22:15:00+00	t	f	yellow	2
119	2019-11-22 00:32:00+00	t	t	green	2
120	2019-11-22 07:14:00+00	t	f	yellow	2
121	2019-11-22 10:44:00+00	t	f	yellow	2
122	2019-11-22 12:32:00+00	t	f	yellow	2
123	2019-11-22 16:30:00+00	t	t	green	2
124	2019-11-23 00:30:00+00	t	f	yellow	2
125	2019-11-23 02:03:00+00	t	f	yellow	2
126	2019-11-23 06:14:00+00	t	f	yellow	2
127	2019-11-23 09:32:00+00	t	f	yellow	2
128	2019-11-23 11:49:00+00	t	f	yellow	2
129	2019-11-23 15:30:00+00	t	t	green	2
130	2019-11-23 16:39:00+00	t	f	yellow	2
131	2019-11-23 17:47:00+00	t	f	yellow	2
132	2019-11-23 23:43:00+00	t	f	yellow	2
133	2019-11-24 01:15:00+00	t	f	yellow	2
134	2019-11-24 03:15:00+00	t	f	yellow	2
135	2019-11-24 07:05:00+00	t	f	yellow	2
136	2019-11-24 07:35:00+00	t	f	yellow	2
137	2019-11-24 11:38:00+00	t	f	yellow	2
138	2019-11-24 16:50:00+00	t	f	yellow	2
139	2019-11-24 17:13:00+00	f	t	green	2
140	2019-11-24 19:15:00+00	t	f	yellow	2
141	2019-11-24 22:00:00+00	t	f	yellow	2
142	2019-11-25 02:13:00+00	t	f	yellow	2
143	2019-11-25 06:09:00+00	t	f	yellow	2
144	2019-11-25 09:42:00+00	t	f	yellow	2
145	2019-11-25 10:05:00+00	f	t	green	2
146	2019-11-25 13:10:00+00	t	f	yellow	2
147	2019-11-25 16:55:00+00	t	f	yellow	2
148	2019-11-25 18:22:00+00	f	t	green	2
149	2019-11-25 20:01:00+00	t	f	yellow	2
150	2019-11-25 23:16:00+00	t	f	yellow	2
151	2019-11-26 01:07:00+00	t	f	yellow	2
152	2019-11-26 03:57:00+00	t	f	yellow	2
153	2019-11-26 07:19:00+00	t	f	yellow	2
154	2019-11-26 11:23:00+00	t	f	yellow	2
155	2019-11-26 15:08:00+00	t	t	green	2
156	2019-11-26 18:27:00+00	t	f	yellow	2
157	2019-11-26 21:30:00+00	t	f	yellow	2
158	2019-11-27 00:09:00+00	t	f	yellow	2
159	2019-11-27 03:25:00+00	t	f	yellow	2
160	2019-11-27 07:15:00+00	t	t	green	2
161	2019-11-27 08:03:00+00	t	f	yellow	2
162	2019-11-27 11:40:00+00	t	f	yellow	2
163	2019-11-27 17:21:00+00	t	f	yellow	2
164	2019-11-27 18:34:00+00	t	f	yellow	2
165	2019-11-27 19:17:00+00	t	f	yellow	2
166	2019-11-28 00:00:00+00	t	f	yellow	2
167	2019-11-28 03:57:00+00	t	f	yellow	2
168	2019-11-28 07:57:00+00	t	f	yellow	2
169	2019-11-28 11:06:00+00	t	f	yellow	2
170	2019-11-28 13:38:00+00	t	t	green	2
171	2019-11-28 15:29:00+00	t	f	yellow	2
172	2019-11-28 19:16:00+00	t	f	yellow	2
173	2019-11-29 00:35:00+00	t	f	yellow	2
174	2019-11-29 02:24:00+00	t	f	yellow	2
175	2019-11-29 07:00:00+00	t	f	yellow	2
176	2019-11-29 10:11:00+00	t	f	yellow	2
177	2019-11-29 14:36:00+00	t	t	green	2
178	2019-11-29 16:30:00+00	t	f	yellow	2
179	2019-11-29 18:42:00+00	t	t	green	2
180	2019-11-29 21:43:00+00	t	f	yellow	2
181	2019-11-30 06:38:00+00	t	f	yellow	2
182	2019-11-30 09:54:00+00	t	f	yellow	2
183	2019-11-30 12:35:00+00	t	f	yellow	2
184	2019-11-30 15:53:00+00	f	t	green	2
185	2019-11-30 15:00:00+00	t	t	green	2
186	2019-11-30 21:12:00+00	t	f	yellow	2
187	2019-11-30 21:57:00+00	t	f	yellow	2
188	2019-12-01 03:44:00+00	t	f	yellow	2
189	2019-12-01 07:57:00+00	t	f	yellow	2
190	2019-12-01 10:47:00+00	t	f	yellow	2
191	2019-12-01 13:17:00+00	t	f	yellow	2
192	2019-12-01 14:50:00+00	t	f	yellow	2
193	2019-12-01 15:33:00+00	f	t	green	2
194	2019-12-01 18:10:00+00	t	f	yellow	2
195	2019-12-01 22:31:00+00	t	t	green	2
196	2019-12-01 23:59:00+00	t	f	yellow	2
197	2019-12-02 00:00:00+00	t	f	yellow	2
198	2019-12-02 02:45:00+00	f	t	yellow	2
199	2019-12-02 04:35:00+00	t	f	yellow	2
200	2019-12-02 06:53:00+00	t	f	yellow	2
201	2019-12-02 09:55:00+00	t	f	yellow	2
202	2019-12-02 13:43:00+00	t	t	green	2
203	2019-12-02 14:05:00+00	f	t	green	2
204	2019-12-02 14:19:00+00	f	t	green	2
205	2019-12-02 15:54:00+00	t	f	yellow	2
206	2019-12-02 21:38:00+00	t	t	green	2
207	2019-12-03 00:39:00+00	t	f	yellow	2
208	2019-12-03 06:25:00+00	t	f	yellow	2
209	2019-12-03 10:03:00+00	t	f	yellow	2
210	2019-12-03 12:29:00+00	t	f	yellow	2
211	2019-12-03 18:10:00+00	t	f	yellow	2
212	2019-12-03 17:11:00+00	t	t	green	2
213	2019-12-03 19:51:00+00	t	f	yellow	2
214	2019-12-03 23:00:00+00	t	f	yellow	2
215	2019-12-04 03:06:00+00	t	f	yellow	2
216	2019-12-04 06:14:00+00	t	f	yellow	2
217	2019-12-04 06:47:00+00	t	f	yellow	2
218	2019-12-04 09:51:00+00	t	f	yellow	2
219	2019-12-04 13:18:00+00	t	t	green	2
220	2019-12-04 16:45:00+00	t	f	yellow	2
221	2019-12-04 15:45:00+00	t	f	yellow	2
222	2019-12-04 22:08:00+00	t	f	yellow	2
223	2019-12-05 01:41:00+00	t	f	yellow	2
224	2019-12-05 07:20:00+00	t	f	yellow	2
225	2019-12-05 10:49:00+00	t	f	yellow	2
226	2019-12-05 14:41:00+00	t	t	green	2
227	2019-12-05 18:28:00+00	t	t	green	2
228	2019-12-05 23:34:00+00	t	f	yellow	2
229	2019-12-06 02:22:00+00	t	f	yellow	2
230	2019-12-06 03:26:00+00	f	t	green	2
231	2019-12-06 06:59:00+00	t	f	yellow	2
232	2019-12-06 10:59:00+00	t	f	yellow	2
233	2019-12-06 14:28:00+00	t	f	yellow	2
234	2019-12-06 19:04:00+00	t	f	yellow	3
235	2019-12-06 21:31:00+00	t	f	yellow	2
236	2019-12-06 23:37:00+00	t	f	yellow	2
237	2019-12-07 02:03:00+00	t	f	yellow	2
238	2019-12-07 03:42:00+00	t	t	green	2
239	2019-12-07 12:47:00+00	t	f	yellow	2
240	2019-12-07 07:47:00+00	t	f	yellow	2
241	2019-12-07 15:36:00+00	t	t	green	2
242	2019-12-07 23:44:00+00	t	f	yellow	2
243	2019-12-08 00:34:00+00	t	f	yellow	2
244	2019-12-08 03:39:00+00	t	f	yellow	2
245	2019-12-08 06:32:00+00	t	f	yellow	2
246	2019-12-08 10:33:00+00	t	f	yellow	2
247	2019-12-07 16:26:00+00	t	f	yellow	2
248	2019-12-08 13:27:00+00	t	f	yellow	2
249	2019-12-07 20:28:00+00	t	f	yellow	2
250	2019-12-08 16:08:00+00	t	f	yellow	2
251	2019-12-08 21:49:00+00	t	t	green	2
252	2019-12-09 07:44:00+00	t	f	yellow	2
253	2019-12-09 11:13:00+00	t	f	yellow	2
254	2019-12-09 12:56:00+00	t	f	yellow	2
255	2019-12-09 17:25:00+00	t	f	yellow	2
256	2019-12-09 21:42:00+00	t	t	green	2
257	2019-12-10 05:30:00+00	t	f	yellow	2
258	2019-12-10 03:30:00+00	t	f	yellow	2
259	2019-12-10 09:06:00+00	t	f	yellow	2
260	2019-12-10 11:37:00+00	t	f	yellow	2
261	2019-12-10 14:07:00+00	t	f	yellow	2
262	2019-12-10 18:17:00+00	t	f	yellow	2
263	2019-12-10 17:18:00+00	t	t	yellow	2
264	2019-12-10 22:06:00+00	t	f	yellow	2
265	2019-12-11 03:37:00+00	t	f	yellow	2
266	2019-12-11 09:02:00+00	t	f	yellow	2
267	2019-12-11 11:16:00+00	t	f	yellow	2
268	2019-12-11 19:12:00+00	t	f	yellow	2
269	2019-12-11 16:12:00+00	t	f	yellow	2
270	2019-12-11 09:52:00+00	t	f	brown	2
271	2019-12-11 21:31:00+00	f	t	brown	2
272	2019-12-11 23:31:00+00	t	f	yellow	2
273	2019-12-12 02:18:00+00	t	f	yellow	2
274	2019-12-12 04:18:00+00	t	f	yellow	2
\.


--
-- Data for Name: core_feeding; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_feeding (id, start, "end", duration, type, method, amount, child_id, units) FROM stdin;
1	2019-11-04 00:42:00+00	2019-11-04 00:42:00+00	00:00:00	breast milk	left breast	15	1	ounces
2	2019-11-04 00:58:00+00	2019-11-04 01:22:00+00	00:24:00	breast milk	right breast	\N	1	ounces
3	2019-11-04 17:42:00+00	2019-11-04 18:10:00+00	00:28:00	breast milk	both breasts	\N	2	ounces
4	2019-11-04 19:17:00+00	2019-11-04 19:30:00+00	00:13:00	breast milk	right breast	\N	2	ounces
5	2019-11-04 22:00:00+00	2019-11-04 22:20:00+00	00:20:00	breast milk	left breast	\N	2	ounces
6	2019-11-04 22:21:00+00	2019-11-04 22:41:00+00	00:20:00	breast milk	right breast	\N	2	ounces
7	2019-11-04 23:20:00+00	2019-11-04 23:40:00+00	00:20:00	breast milk	right breast	\N	2	ounces
8	2019-11-05 01:00:00+00	2019-11-05 01:40:00+00	00:40:00	breast milk	both breasts	\N	2	ounces
9	2019-11-05 02:10:00+00	2019-11-05 02:20:00+00	00:10:00	breast milk	both breasts	\N	2	ounces
10	2019-11-05 15:06:00+00	2019-11-05 15:23:00+00	00:17:00	breast milk	left breast	\N	2	ounces
11	2019-11-07 19:08:00+00	2019-11-07 19:27:00+00	00:19:00	breast milk	right breast	\N	2	ounces
12	2019-11-07 19:30:00+00	2019-11-07 19:50:00+00	00:20:00	breast milk	left breast	\N	2	ounces
13	2019-11-07 23:14:00+00	2019-11-07 23:36:00+00	00:22:00	breast milk	left breast	\N	2	ounces
14	2019-11-07 23:46:00+00	2019-11-07 23:56:00+00	00:10:00	breast milk	left breast	\N	2	ounces
15	2019-11-08 00:01:00+00	2019-11-08 00:11:00+00	00:10:00	breast milk	right breast	\N	2	ounces
16	2019-11-08 00:35:00+00	2019-11-08 00:51:00+00	00:16:00	breast milk	right breast	\N	2	ounces
17	2019-11-08 00:53:00+00	2019-11-08 01:10:00+00	00:17:00	breast milk	left breast	\N	2	ounces
18	2019-11-08 01:41:00+00	2019-11-08 01:49:00+00	00:08:00	breast milk	left breast	\N	2	ounces
19	2019-11-08 03:30:00+00	2019-11-08 03:30:00+00	00:00:00	formula	bottle	2	2	ounces
20	2019-11-08 07:26:00+00	2019-11-08 07:26:00+00	00:00:00	formula	bottle	3	2	ounces
21	2019-11-08 12:29:00+00	2019-11-08 12:32:00+00	00:03:00	formula	bottle	3.5	2	ounces
22	2019-11-08 15:59:00+00	2019-11-08 16:01:00+00	00:02:00	formula	bottle	3	2	ounces
23	2019-11-08 18:38:00+00	2019-11-08 19:00:00+00	00:22:00	formula	bottle	3	2	ounces
24	2019-11-08 22:07:00+00	2019-11-08 22:21:00+00	00:14:00	formula	bottle	2.5	2	ounces
25	2019-11-08 23:45:00+00	2019-11-09 00:14:00+00	00:29:00	formula	bottle	2	2	ounces
26	2019-11-09 03:51:00+00	2019-11-09 04:39:00+00	00:48:00	formula	bottle	3	2	ounces
27	2019-11-09 08:29:00+00	2019-11-09 08:29:00+00	00:00:00	formula	bottle	3	2	ounces
28	2019-11-09 13:25:00+00	2019-11-09 13:25:00+00	00:00:00	formula	bottle	3	2	ounces
29	2019-11-09 15:53:00+00	2019-11-09 15:53:00+00	00:00:00	formula	bottle	1.5	2	ounces
30	2019-11-09 20:02:00+00	2019-11-09 20:02:00+00	00:00:00	formula	bottle	3	2	ounces
32	2019-11-09 23:53:00+00	2019-11-10 00:20:00+00	00:27:00	formula	bottle	3	2	ounces
33	2019-11-10 00:57:00+00	2019-11-10 00:57:00+00	00:00:00	formula	bottle	1	2	ounces
34	2019-11-10 03:55:00+00	2019-11-10 03:56:00+00	00:01:00	formula	bottle	3	2	ounces
35	2019-11-10 07:46:00+00	2019-11-10 08:16:00+00	00:30:00	formula	bottle	3	2	ounces
37	2019-11-10 12:27:00+00	2019-11-10 12:54:00+00	00:27:00	formula	bottle	3	2	ounces
36	2019-11-10 08:34:00+00	2019-11-10 08:34:00+00	00:00:00	formula	bottle	3.5	2	ounces
38	2019-11-10 15:03:00+00	2019-11-10 15:22:00+00	00:19:00	formula	bottle	2	2	ounces
39	2019-11-10 17:00:00+00	2019-11-10 17:10:00+00	00:10:00	formula	bottle	1	2	ounces
40	2019-11-10 18:30:00+00	2019-11-10 18:33:00+00	00:03:00	formula	bottle	1.5	2	ounces
41	2019-11-10 21:05:00+00	2019-11-10 21:30:00+00	00:25:00	formula	bottle	3.5	2	ounces
42	2019-11-10 21:51:00+00	2019-11-10 21:52:00+00	00:01:00	formula	bottle	1	2	ounces
43	2019-11-11 00:00:00+00	2019-11-11 00:15:00+00	00:15:00	formula	bottle	2	2	ounces
44	2019-11-11 02:00:00+00	2019-11-11 02:32:00+00	00:32:00	formula	bottle	2.5	2	ounces
45	2019-11-11 05:00:00+00	2019-11-11 05:30:00+00	00:30:00	formula	bottle	4	2	ounces
46	2019-11-11 10:35:00+00	2019-11-11 11:10:00+00	00:35:00	formula	bottle	3	2	ounces
47	2019-11-11 14:50:00+00	2019-11-11 15:20:00+00	00:30:00	formula	bottle	4	2	ounces
48	2019-11-11 18:30:00+00	2019-11-11 19:10:00+00	00:40:00	formula	bottle	2.5	2	ounces
49	2019-11-11 22:19:00+00	2019-11-11 23:17:00+00	00:58:00	formula	bottle	3	2	ounces
50	2019-11-12 04:00:00+00	2019-11-12 04:33:00+00	00:33:00	formula	bottle	3	2	ounces
51	2019-11-12 07:39:00+00	2019-11-12 08:05:00+00	00:26:00	formula	bottle	3	2	ounces
52	2019-11-12 11:32:00+00	2019-11-12 11:50:00+00	00:18:00	formula	bottle	2	2	ounces
53	2019-11-12 14:10:00+00	2019-11-12 14:39:00+00	00:29:00	formula	bottle	3	2	ounces
54	2019-11-12 18:06:00+00	2019-11-12 18:06:00+00	00:00:00	formula	bottle	3	2	ounces
55	2019-11-12 20:45:00+00	2019-11-12 21:00:00+00	00:15:00	formula	bottle	3	2	ounces
56	2019-11-12 22:37:00+00	2019-11-12 22:45:00+00	00:08:00	formula	bottle	1.5	2	ounces
57	2019-11-12 23:48:00+00	2019-11-12 23:48:00+00	00:00:00	formula	bottle	1.5	2	ounces
58	2019-11-13 00:31:00+00	2019-11-13 00:45:00+00	00:14:00	formula	bottle	1	2	ounces
59	2019-11-13 03:18:00+00	2019-11-13 03:53:00+00	00:35:00	formula	bottle	3.5	2	ounces
60	2019-11-13 07:03:00+00	2019-11-13 07:28:00+00	00:25:00	formula	bottle	3	2	ounces
61	2019-11-13 10:39:00+00	2019-11-13 11:08:00+00	00:29:00	formula	bottle	2.5	2	ounces
62	2019-11-13 13:14:00+00	2019-11-13 13:50:00+00	00:36:00	formula	bottle	4	2	ounces
63	2019-11-13 16:00:00+00	2019-11-13 16:30:00+00	00:30:00	formula	bottle	2.5	2	ounces
64	2019-11-13 19:24:00+00	2019-11-13 19:57:00+00	00:33:00	formula	bottle	3	2	ounces
65	2019-11-13 23:11:00+00	2019-11-13 23:35:00+00	00:24:00	formula	bottle	2.5	2	ounces
69	2019-11-14 08:20:00+00	2019-11-14 08:34:00+00	00:14:00	formula	bottle	0.5	2	ounces
66	2019-11-14 00:54:00+00	2019-11-14 01:36:00+00	00:42:00	formula	bottle	3.5	2	ounces
67	2019-11-14 04:00:00+00	2019-11-14 04:52:00+00	00:52:00	formula	bottle	2	2	ounces
68	2019-11-14 07:32:00+00	2019-11-14 08:01:00+00	00:29:00	formula	bottle	2	2	ounces
70	2019-11-14 12:08:00+00	2019-11-14 12:30:00+00	00:22:00	formula	bottle	3	2	ounces
71	2019-11-14 13:10:00+00	2019-11-14 13:25:00+00	00:15:00	formula	bottle	1	2	ounces
72	2019-11-14 16:00:00+00	2019-11-14 16:15:00+00	00:15:00	formula	bottle	2	2	ounces
73	2019-11-14 18:46:00+00	2019-11-14 19:09:00+00	00:23:00	formula	bottle	2	2	ounces
74	2019-11-14 22:09:00+00	2019-11-14 22:33:00+00	00:24:00	formula	bottle	3.5	2	ounces
75	2019-11-15 00:19:00+00	2019-11-15 01:00:00+00	00:41:00	formula	bottle	3	2	ounces
77	2019-11-15 03:20:00+00	2019-11-15 04:24:00+00	01:04:00	formula	bottle	3	2	ounces
78	2019-11-15 06:40:00+00	2019-11-15 06:40:00+00	00:00:00	formula	bottle	2	2	ounces
79	2019-11-15 09:27:00+00	2019-11-15 09:53:00+00	00:26:00	formula	bottle	3.5	2	ounces
80	2019-11-15 13:50:00+00	2019-11-15 14:20:00+00	00:30:00	formula	bottle	3	2	ounces
81	2019-11-15 18:07:00+00	2019-11-15 18:07:00+00	00:00:00	formula	bottle	4	2	ounces
82	2019-11-15 19:50:00+00	2019-11-15 20:27:00+00	00:37:00	formula	bottle	1.5	2	ounces
83	2019-11-15 23:24:00+00	2019-11-15 23:40:00+00	00:16:00	formula	bottle	3	2	ounces
84	2019-11-16 01:50:00+00	2019-11-16 02:11:00+00	00:21:00	formula	bottle	1	2	ounces
85	2019-11-16 03:10:00+00	2019-11-16 03:37:00+00	00:27:00	formula	bottle	1.5	2	ounces
86	2019-11-16 04:20:00+00	2019-11-16 04:31:00+00	00:11:00	formula	bottle	1	2	ounces
87	2019-11-16 07:10:00+00	2019-11-16 07:10:00+00	00:00:00	formula	bottle	3	2	ounces
88	2019-11-16 10:39:00+00	2019-11-16 10:39:00+00	00:00:00	formula	bottle	3	2	ounces
89	2019-11-16 14:11:00+00	2019-11-16 14:38:00+00	00:27:00	formula	bottle	3	2	ounces
90	2019-11-16 16:20:00+00	2019-11-16 16:29:00+00	00:09:00	formula	bottle	1.5	2	ounces
91	2019-11-16 19:37:00+00	2019-11-16 19:37:00+00	00:00:00	formula	bottle	3	2	ounces
92	2019-11-16 23:31:00+00	2019-11-16 23:31:00+00	00:00:00	formula	bottle	3	2	ounces
143	2019-11-22 00:55:00+00	2019-11-22 00:56:00+00	00:01:00	formula	bottle	3	2	ounces
93	2019-11-17 01:38:00+00	2019-11-17 02:06:00+00	00:28:00	formula	bottle	3	2	ounces
94	2019-11-17 03:30:00+00	2019-11-17 03:35:00+00	00:05:00	formula	bottle	1.5	2	ounces
95	2019-11-17 04:54:00+00	2019-11-17 05:10:00+00	00:16:00	formula	bottle	1.5	2	ounces
96	2019-11-17 08:24:00+00	2019-11-17 08:37:00+00	00:13:00	formula	bottle	3	2	ounces
97	2019-11-17 11:25:00+00	2019-11-17 11:25:00+00	00:00:00	formula	bottle	3	2	ounces
128	2019-11-20 10:29:00+00	2019-11-20 10:37:00+00	00:08:00	formula	bottle	2.5	2	ounces
98	2019-11-17 13:54:00+00	2019-11-17 14:39:00+00	00:45:00	formula	bottle	3	2	ounces
99	2019-11-17 16:19:00+00	2019-11-17 16:35:00+00	00:16:00	formula	bottle	2	2	ounces
100	2019-11-17 17:42:00+00	2019-11-17 17:42:00+00	00:00:00	formula	bottle	2	2	ounces
101	2019-11-17 21:25:00+00	2019-11-17 21:39:00+00	00:14:00	formula	bottle	2.5	2	ounces
103	2019-11-18 00:25:00+00	2019-11-18 00:36:00+00	00:11:00	formula	bottle	1	2	ounces
102	2019-11-17 22:51:00+00	2019-11-17 22:53:00+00	00:02:00	formula	bottle	2	2	ounces
105	2019-11-18 04:10:00+00	2019-11-18 04:30:00+00	00:20:00	formula	bottle	3	2	ounces
104	2019-11-18 02:00:00+00	2019-11-18 02:01:00+00	00:01:00	formula	bottle	3	2	ounces
106	2019-11-18 07:45:00+00	2019-11-18 08:06:00+00	00:21:00	formula	bottle	3	2	ounces
107	2019-11-18 10:46:00+00	2019-11-18 11:08:00+00	00:22:00	formula	bottle	2	2	ounces
108	2019-11-18 11:15:00+00	2019-11-18 11:20:00+00	00:05:00	formula	bottle	0.5	2	ounces
109	2019-11-18 13:17:00+00	2019-11-18 13:40:00+00	00:23:00	formula	bottle	3	2	ounces
110	2019-11-18 16:07:00+00	2019-11-18 16:30:00+00	00:23:00	formula	bottle	2	2	ounces
111	2019-11-18 18:52:00+00	2019-11-18 19:16:00+00	00:24:00	formula	bottle	3	2	ounces
113	2019-11-18 19:45:00+00	2019-11-18 19:46:00+00	00:01:00	formula	bottle	0.5	2	ounces
112	2019-11-18 19:26:00+00	2019-11-18 19:27:00+00	00:01:00	formula	bottle	0.5	2	ounces
114	2019-11-18 22:23:00+00	2019-11-18 22:38:00+00	00:15:00	formula	bottle	3	2	ounces
115	2019-11-19 00:10:00+00	2019-11-19 00:18:00+00	00:08:00	formula	bottle	1	2	ounces
116	2019-11-19 02:10:00+00	2019-11-19 02:48:00+00	00:38:00	formula	bottle	4	2	ounces
117	2019-11-19 04:40:00+00	2019-11-19 04:59:00+00	00:19:00	formula	bottle	3	2	ounces
118	2019-11-19 07:52:00+00	2019-11-19 08:25:00+00	00:33:00	formula	bottle	3.5	2	ounces
119	2019-11-19 10:44:00+00	2019-11-19 11:04:00+00	00:20:00	formula	bottle	2	2	ounces
120	2019-11-19 13:17:00+00	2019-11-19 13:41:00+00	00:24:00	formula	bottle	2.5	2	ounces
121	2019-11-19 16:14:00+00	2019-11-19 16:30:00+00	00:16:00	formula	bottle	3	2	ounces
122	2019-11-19 18:32:00+00	2019-11-19 18:58:00+00	00:26:00	formula	bottle	1.5	2	ounces
123	2019-11-19 20:54:00+00	2019-11-19 21:27:00+00	00:33:00	formula	bottle	2	2	ounces
124	2019-11-19 22:22:00+00	2019-11-19 22:27:00+00	00:05:00	formula	bottle	1	2	ounces
125	2019-11-20 00:48:00+00	2019-11-20 00:48:00+00	00:00:00	formula	bottle	3	2	ounces
129	2019-11-20 12:56:00+00	2019-11-20 13:11:00+00	00:15:00	formula	bottle	2.5	2	ounces
126	2019-11-20 02:39:00+00	2019-11-20 03:07:00+00	00:28:00	formula	bottle	4	2	ounces
127	2019-11-20 06:12:00+00	2019-11-20 06:41:00+00	00:29:00	formula	bottle	3	2	ounces
130	2019-11-20 16:07:00+00	2019-11-20 16:13:00+00	00:06:00	formula	bottle	3.5	2	ounces
131	2019-11-20 20:04:00+00	2019-11-20 20:29:00+00	00:25:00	formula	bottle	3	2	ounces
132	2019-11-20 21:27:00+00	2019-11-20 21:27:00+00	00:00:00	formula	bottle	1	2	ounces
133	2019-11-20 22:51:00+00	2019-11-20 22:56:00+00	00:05:00	formula	bottle	2	2	ounces
134	2019-11-21 01:17:00+00	2019-11-21 01:45:00+00	00:28:00	formula	bottle	3	2	ounces
135	2019-11-21 03:57:00+00	2019-11-21 04:17:00+00	00:20:00	formula	bottle	3.5	2	ounces
136	2019-11-21 08:13:00+00	2019-11-21 08:33:00+00	00:20:00	formula	bottle	3.5	2	ounces
137	2019-11-21 12:26:00+00	2019-11-21 12:41:00+00	00:15:00	formula	bottle	3.5	2	ounces
138	2019-11-21 16:42:00+00	2019-11-21 17:00:00+00	00:18:00	formula	bottle	3.5	2	ounces
139	2019-11-21 19:12:00+00	2019-11-21 19:39:00+00	00:27:00	formula	bottle	3	2	ounces
140	2019-11-21 20:54:00+00	2019-11-21 20:56:00+00	00:02:00	formula	bottle	1	2	ounces
141	2019-11-21 22:16:00+00	2019-11-21 22:31:00+00	00:15:00	formula	bottle	1	2	ounces
142	2019-11-21 23:33:00+00	2019-11-21 23:37:00+00	00:04:00	formula	bottle	2	2	ounces
144	2019-11-22 03:29:00+00	2019-11-22 03:51:00+00	00:22:00	formula	bottle	2	2	ounces
145	2019-11-22 07:13:00+00	2019-11-22 07:13:00+00	00:00:00	formula	bottle	3	2	ounces
146	2019-11-22 10:19:00+00	2019-11-22 10:42:00+00	00:23:00	formula	bottle	3	2	ounces
147	2019-11-22 12:21:00+00	2019-11-22 12:21:00+00	00:00:00	formula	bottle	1.5	2	ounces
148	2019-11-22 12:43:00+00	2019-11-22 12:44:00+00	00:01:00	formula	bottle	1.5	2	ounces
149	2019-11-22 17:18:00+00	2019-11-22 18:00:00+00	00:42:00	formula	bottle	2	2	ounces
150	2019-11-22 18:49:00+00	2019-11-22 19:04:00+00	00:15:00	formula	bottle	2	2	ounces
151	2019-11-22 22:30:00+00	2019-11-22 22:50:00+00	00:20:00	formula	bottle	4	2	ounces
152	2019-11-23 01:46:00+00	2019-11-23 02:07:00+00	00:21:00	formula	bottle	3	2	ounces
153	2019-11-23 02:53:00+00	2019-11-23 02:53:00+00	00:00:00	formula	bottle	1	2	ounces
154	2019-11-23 06:14:00+00	2019-11-23 06:34:00+00	00:20:00	formula	bottle	3.5	2	ounces
155	2019-11-23 09:13:00+00	2019-11-23 09:35:00+00	00:22:00	formula	bottle	2.5	2	ounces
156	2019-11-23 11:47:00+00	2019-11-23 11:49:00+00	00:02:00	formula	bottle	3	2	ounces
157	2019-11-23 14:27:00+00	2019-11-23 15:02:00+00	00:35:00	formula	bottle	2	2	ounces
158	2019-11-23 16:51:00+00	2019-11-23 17:22:00+00	00:31:00	formula	bottle	4	2	ounces
159	2019-11-23 20:30:00+00	2019-11-23 20:45:00+00	00:15:00	formula	bottle	3	2	ounces
161	2019-11-23 23:47:00+00	2019-11-24 00:41:00+00	00:54:00	formula	bottle	3	2	ounces
162	2019-11-24 01:02:00+00	2019-11-24 01:03:00+00	00:01:00	formula	bottle	0.75	2	ounces
163	2019-11-24 03:21:00+00	2019-11-24 03:44:00+00	00:23:00	formula	bottle	3.5	2	ounces
164	2019-11-24 07:04:00+00	2019-11-24 07:46:00+00	00:42:00	formula	bottle	4	2	ounces
165	2019-11-24 08:47:00+00	2019-11-24 08:47:00+00	00:00:00	formula	bottle	1	2	ounces
166	2019-11-24 11:38:00+00	2019-11-24 11:38:00+00	00:00:00	formula	bottle	3.5	2	ounces
168	2019-11-24 14:12:00+00	2019-11-24 14:38:00+00	00:26:00	formula	bottle	3.5	2	ounces
169	2019-11-24 16:51:00+00	2019-11-24 17:04:00+00	00:13:00	formula	bottle	3	2	ounces
170	2019-11-24 19:18:00+00	2019-11-24 19:42:00+00	00:24:00	formula	bottle	3.5	2	ounces
171	2019-11-24 20:25:00+00	2019-11-24 20:30:00+00	00:05:00	formula	bottle	1	2	ounces
172	2019-11-24 22:02:00+00	2019-11-24 22:23:00+00	00:21:00	formula	bottle	3	2	ounces
173	2019-11-24 23:47:00+00	2019-11-25 00:07:00+00	00:20:00	formula	bottle	2.5	2	ounces
174	2019-11-24 23:47:00+00	2019-11-25 00:07:00+00	00:20:00	formula	bottle	2.5	2	ounces
175	2019-11-25 02:41:00+00	2019-11-25 02:53:00+00	00:12:00	formula	bottle	3	2	ounces
176	2019-11-25 06:06:00+00	2019-11-25 06:33:00+00	00:27:00	formula	bottle	3	2	ounces
177	2019-11-25 09:25:00+00	2019-11-25 09:42:00+00	00:17:00	formula	bottle	4	2	ounces
178	2019-11-25 13:10:00+00	2019-11-25 13:28:00+00	00:18:00	formula	bottle	4	2	ounces
179	2019-11-25 17:00:00+00	2019-11-25 17:14:00+00	00:14:00	formula	bottle	4	2	ounces
180	2019-11-25 18:23:00+00	2019-11-25 18:24:00+00	00:01:00	formula	bottle	1	2	ounces
181	2019-11-25 20:01:00+00	2019-11-25 20:29:00+00	00:28:00	formula	bottle	3.5	2	ounces
182	2019-11-25 23:29:00+00	2019-11-25 23:43:00+00	00:14:00	formula	bottle	4	2	ounces
183	2019-11-26 00:43:00+00	2019-11-26 00:44:00+00	00:01:00	formula	bottle	1	2	ounces
184	2019-11-26 01:41:00+00	2019-11-26 01:42:00+00	00:01:00	formula	bottle	1	2	ounces
185	2019-11-26 03:38:00+00	2019-11-26 03:56:00+00	00:18:00	formula	bottle	4	2	ounces
186	2019-11-26 07:06:00+00	2019-11-26 07:30:00+00	00:24:00	formula	bottle	4	2	ounces
187	2019-11-26 11:25:00+00	2019-11-26 11:25:00+00	00:00:00	formula	bottle	4	2	ounces
188	2019-11-26 13:06:00+00	2019-11-26 13:07:00+00	00:01:00	formula	bottle	1	2	ounces
189	2019-11-26 17:52:00+00	2019-11-26 17:53:00+00	00:01:00	formula	bottle	3.5	2	ounces
190	2019-11-26 15:00:00+00	2019-11-26 15:10:00+00	00:10:00	formula	bottle	3	2	ounces
226	2019-11-30 12:22:00+00	2019-11-30 12:45:00+00	00:23:00	formula	bottle	4	2	ounces
191	2019-11-26 18:59:00+00	2019-11-26 19:00:00+00	00:01:00	formula	bottle	2	2	ounces
192	2019-11-26 21:34:00+00	2019-11-26 22:09:00+00	00:35:00	formula	bottle	3.5	2	ounces
193	2019-11-26 23:12:00+00	2019-11-26 23:26:00+00	00:14:00	formula	bottle	1	2	ounces
194	2019-11-27 00:35:00+00	2019-11-27 00:46:00+00	00:11:00	formula	bottle	3	2	ounces
197	2019-11-27 03:24:00+00	2019-11-27 03:50:00+00	00:26:00	formula	bottle	2.5	2	ounces
196	2019-11-27 01:39:00+00	2019-11-27 01:52:00+00	00:13:00	formula	bottle	2	2	ounces
198	2019-11-27 06:57:00+00	2019-11-27 07:20:00+00	00:23:00	formula	bottle	4	2	ounces
199	2019-11-27 07:30:00+00	2019-11-27 07:36:00+00	00:06:00	formula	bottle	1	2	ounces
200	2019-11-27 10:24:00+00	2019-11-27 10:42:00+00	00:18:00	formula	bottle	4	2	ounces
201	2019-11-27 13:02:00+00	2019-11-27 13:19:00+00	00:17:00	formula	bottle	3	2	ounces
202	2019-11-27 16:30:00+00	2019-11-27 16:53:00+00	00:23:00	formula	bottle	3.5	2	ounces
203	2019-11-27 18:45:00+00	2019-11-27 19:09:00+00	00:24:00	formula	bottle	3	2	ounces
204	2019-11-27 22:41:00+00	2019-11-27 23:05:00+00	00:24:00	formula	bottle	4.5	2	ounces
205	2019-11-28 00:41:00+00	2019-11-28 00:52:00+00	00:11:00	formula	bottle	3	2	ounces
206	2019-11-28 03:29:00+00	2019-11-28 03:50:00+00	00:21:00	formula	bottle	3	2	ounces
207	2019-11-28 04:45:00+00	2019-11-28 04:53:00+00	00:08:00	formula	bottle	1	2	ounces
208	2019-11-28 07:46:00+00	2019-11-28 08:05:00+00	00:19:00	formula	bottle	4	2	ounces
209	2019-11-28 10:47:00+00	2019-11-28 11:06:00+00	00:19:00	formula	bottle	4	2	ounces
210	2019-11-28 13:59:00+00	2019-11-28 14:30:00+00	00:31:00	formula	bottle	3.5	2	ounces
211	2019-11-28 17:27:00+00	2019-11-28 17:57:00+00	00:30:00	formula	bottle	4	2	ounces
212	2019-11-28 21:13:00+00	2019-11-28 21:30:00+00	00:17:00	formula	bottle	4	2	ounces
213	2019-11-29 00:01:00+00	2019-11-29 00:31:00+00	00:30:00	formula	bottle	4	2	ounces
214	2019-11-29 02:33:00+00	2019-11-29 03:00:00+00	00:27:00	formula	bottle	3.5	2	ounces
215	2019-11-29 06:40:00+00	2019-11-29 06:59:00+00	00:19:00	formula	bottle	4	2	ounces
216	2019-11-29 09:48:00+00	2019-11-29 10:11:00+00	00:23:00	formula	bottle	4	2	ounces
217	2019-11-29 13:54:00+00	2019-11-29 14:07:00+00	00:13:00	formula	bottle	3.5	2	ounces
218	2019-11-29 16:24:00+00	2019-11-29 16:38:00+00	00:14:00	formula	bottle	4	2	ounces
219	2019-11-29 18:41:00+00	2019-11-29 19:30:00+00	00:49:00	formula	bottle	4	2	ounces
220	2019-11-29 21:39:00+00	2019-11-29 21:55:00+00	00:16:00	formula	bottle	3.5	2	ounces
221	2019-11-30 00:10:00+00	2019-11-30 00:26:00+00	00:16:00	formula	bottle	2.5	2	ounces
222	2019-11-30 01:46:00+00	2019-11-30 01:56:00+00	00:10:00	formula	bottle	1.5	2	ounces
223	2019-11-30 02:49:00+00	2019-11-30 03:00:00+00	00:11:00	formula	bottle	2.5	2	ounces
224	2019-11-30 06:36:00+00	2019-11-30 07:04:00+00	00:28:00	formula	bottle	4	2	ounces
225	2019-11-30 09:37:00+00	2019-11-30 09:54:00+00	00:17:00	formula	bottle	4	2	ounces
228	2019-11-30 15:30:00+00	2019-11-30 15:54:00+00	00:24:00	formula	bottle	4	2	ounces
229	2019-11-30 17:50:00+00	2019-11-30 18:04:00+00	00:14:00	formula	bottle	3	2	ounces
230	2019-11-30 21:14:00+00	2019-11-30 21:46:00+00	00:32:00	formula	bottle	4	2	ounces
231	2019-11-30 23:13:00+00	2019-11-30 23:34:00+00	00:21:00	formula	bottle	2.5	2	ounces
232	2019-12-01 03:29:00+00	2019-12-01 03:44:00+00	00:15:00	formula	bottle	4	2	ounces
233	2019-12-01 06:31:00+00	2019-12-01 07:01:00+00	00:30:00	formula	bottle	4	2	ounces
234	2019-12-01 08:04:00+00	2019-12-01 08:06:00+00	00:02:00	formula	bottle	0.5	2	ounces
235	2019-12-01 10:47:00+00	2019-12-01 10:47:00+00	00:00:00	formula	bottle	4	2	ounces
236	2019-12-01 14:03:00+00	2019-12-01 14:14:00+00	00:11:00	formula	bottle	4	2	ounces
237	2019-12-01 16:47:00+00	2019-12-01 17:05:00+00	00:18:00	formula	bottle	3.5	2	ounces
238	2019-12-01 18:08:00+00	2019-12-01 18:18:00+00	00:10:00	formula	bottle	1	2	ounces
239	2019-12-01 20:47:00+00	2019-12-01 21:00:00+00	00:13:00	formula	bottle	3.5	2	ounces
240	2019-12-01 22:10:00+00	2019-12-01 22:15:00+00	00:05:00	formula	bottle	1	2	ounces
241	2019-12-02 00:00:00+00	2019-12-02 00:15:00+00	00:15:00	formula	bottle	4	2	ounces
242	2019-12-02 02:53:00+00	2019-12-02 03:09:00+00	00:16:00	formula	bottle	4	2	ounces
243	2019-12-02 06:30:00+00	2019-12-02 06:49:00+00	00:19:00	formula	bottle	4	2	ounces
244	2019-12-02 07:12:00+00	2019-12-02 07:22:00+00	00:10:00	formula	bottle	1	2	ounces
245	2019-12-02 09:44:00+00	2019-12-02 10:04:00+00	00:20:00	formula	bottle	4	2	ounces
246	2019-12-02 13:01:00+00	2019-12-02 13:27:00+00	00:26:00	formula	bottle	4	2	ounces
247	2019-12-02 15:23:00+00	2019-12-02 15:54:00+00	00:31:00	formula	bottle	3	2	ounces
248	2019-12-02 16:42:00+00	2019-12-02 16:52:00+00	00:10:00	formula	bottle	1	2	ounces
249	2019-12-02 17:30:00+00	2019-12-02 18:00:00+00	00:30:00	formula	bottle	4	2	ounces
250	2019-12-02 21:23:00+00	2019-12-02 21:38:00+00	00:15:00	formula	bottle	4	2	ounces
251	2019-12-03 00:23:00+00	2019-12-03 00:38:00+00	00:15:00	formula	bottle	4	2	ounces
252	2019-12-03 01:21:00+00	2019-12-03 01:31:00+00	00:10:00	formula	bottle	2	2	ounces
254	2019-12-03 06:15:00+00	2019-12-03 06:32:00+00	00:17:00	formula	bottle	4	2	ounces
255	2019-12-03 09:45:00+00	2019-12-03 10:02:00+00	00:17:00	formula	bottle	4	2	ounces
256	2019-12-03 12:19:00+00	2019-12-03 12:29:00+00	00:10:00	formula	bottle	4	2	ounces
257	2019-12-03 15:31:00+00	2019-12-03 15:52:00+00	00:21:00	formula	bottle	4	2	ounces
258	2019-12-03 17:44:00+00	2019-12-03 17:54:00+00	00:10:00	formula	bottle	3	2	ounces
259	2019-12-03 19:51:00+00	2019-12-03 20:08:00+00	00:17:00	formula	bottle	2	2	ounces
260	2019-12-03 22:26:00+00	2019-12-03 22:36:00+00	00:10:00	formula	bottle	4	2	ounces
261	2019-12-04 01:10:00+00	2019-12-04 01:40:00+00	00:30:00	formula	bottle	3.5	2	ounces
262	2019-12-04 03:08:00+00	2019-12-04 03:36:00+00	00:28:00	formula	bottle	3	2	ounces
263	2019-12-04 06:13:00+00	2019-12-04 06:30:00+00	00:17:00	formula	bottle	4	2	ounces
264	2019-12-04 09:32:00+00	2019-12-04 09:51:00+00	00:19:00	formula	bottle	4	2	ounces
265	2019-12-04 12:52:00+00	2019-12-04 13:31:00+00	00:39:00	formula	bottle	4	2	ounces
266	2019-12-04 15:41:00+00	2019-12-04 16:19:00+00	00:38:00	formula	bottle	4	2	ounces
267	2019-12-04 18:06:00+00	2019-12-04 18:13:00+00	00:07:00	formula	bottle	4	2	ounces
268	2019-12-04 21:33:00+00	2019-12-04 22:00:00+00	00:27:00	formula	bottle	4	2	ounces
269	2019-12-05 00:07:00+00	2019-12-05 00:13:00+00	00:06:00	formula	bottle	2	2	ounces
270	2019-12-05 00:48:00+00	2019-12-05 00:58:00+00	00:10:00	formula	bottle	2	2	ounces
271	2019-12-05 02:20:00+00	2019-12-05 02:30:00+00	00:10:00	formula	bottle	3	2	ounces
272	2019-12-05 07:02:00+00	2019-12-05 07:20:00+00	00:18:00	formula	bottle	4	2	ounces
273	2019-12-05 10:34:00+00	2019-12-05 10:56:00+00	00:22:00	formula	bottle	4	2	ounces
274	2019-12-05 14:31:00+00	2019-12-05 14:41:00+00	00:10:00	formula	bottle	4	2	ounces
275	2019-12-05 17:05:00+00	2019-12-05 18:06:00+00	01:01:00	formula	bottle	4	2	ounces
276	2019-12-05 18:45:00+00	2019-12-05 18:56:00+00	00:11:00	formula	bottle	1	2	ounces
277	2019-12-05 20:15:00+00	2019-12-05 20:40:00+00	00:25:00	formula	bottle	2	2	ounces
278	2019-12-05 23:34:00+00	2019-12-06 00:00:00+00	00:26:00	formula	bottle	4	2	ounces
279	2019-12-06 03:14:00+00	2019-12-06 03:34:00+00	00:20:00	formula	bottle	3	2	ounces
280	2019-12-06 06:05:00+00	2019-12-06 06:15:00+00	00:10:00	formula	bottle	2.5	2	ounces
281	2019-12-06 06:49:00+00	2019-12-06 06:59:00+00	00:10:00	formula	bottle	2.5	2	ounces
282	2019-12-06 10:36:00+00	2019-12-06 10:58:00+00	00:22:00	formula	bottle	4	2	ounces
283	2019-12-06 13:55:00+00	2019-12-06 14:28:00+00	00:33:00	formula	bottle	3.5	2	ounces
284	2019-12-06 17:01:00+00	2019-12-06 17:15:00+00	00:14:00	formula	bottle	4	2	ounces
285	2019-12-06 17:01:00+00	2019-12-06 17:15:00+00	00:14:00	formula	bottle	2	2	ounces
287	2019-12-06 21:20:00+00	2019-12-06 21:30:00+00	00:10:00	formula	bottle	4	2	ounces
288	2019-12-06 22:02:00+00	2019-12-06 22:12:00+00	00:10:00	formula	bottle	2	2	ounces
289	2019-12-07 00:46:00+00	2019-12-07 01:00:00+00	00:14:00	formula	bottle	3	2	ounces
290	2019-12-07 03:18:00+00	2019-12-07 03:42:00+00	00:24:00	formula	bottle	4	2	ounces
291	2019-12-07 07:26:00+00	2019-12-07 07:45:00+00	00:19:00	formula	bottle	4	2	ounces
292	2019-12-07 09:59:00+00	2019-12-07 10:17:00+00	00:18:00	formula	bottle	4	2	ounces
293	2019-12-07 12:33:00+00	2019-12-07 12:55:00+00	00:22:00	formula	bottle	2	2	ounces
294	2019-12-07 15:27:00+00	2019-12-07 15:37:00+00	00:10:00	formula	bottle	2.5	2	ounces
295	2019-12-07 18:56:00+00	2019-12-07 19:06:00+00	00:10:00	formula	bottle	4	2	ounces
296	2019-12-07 23:51:00+00	2019-12-08 00:10:00+00	00:19:00	formula	bottle	4	2	ounces
297	2019-12-08 03:12:00+00	2019-12-08 03:39:00+00	00:27:00	formula	bottle	4	2	ounces
298	2019-12-08 06:22:00+00	2019-12-08 06:50:00+00	00:28:00	formula	bottle	4	2	ounces
299	2019-12-08 10:23:00+00	2019-12-08 10:33:00+00	00:10:00	formula	bottle	4	2	ounces
300	2019-12-08 13:14:00+00	2019-12-08 13:24:00+00	00:10:00	formula	bottle	4	2	ounces
301	2019-12-08 15:41:00+00	2019-12-08 16:20:00+00	00:39:00	formula	bottle	2	2	ounces
302	2019-12-08 19:37:00+00	2019-12-08 20:01:00+00	00:24:00	formula	bottle	4	2	ounces
303	2019-12-08 21:53:00+00	2019-12-08 22:15:00+00	00:22:00	formula	bottle	3	2	ounces
304	2019-12-09 01:13:00+00	2019-12-09 01:23:00+00	00:10:00	formula	bottle	4	2	ounces
305	2019-12-09 03:26:00+00	2019-12-09 03:52:00+00	00:26:00	formula	bottle	2.5	2	ounces
306	2019-12-09 07:32:00+00	2019-12-09 07:47:00+00	00:15:00	formula	bottle	4	2	ounces
307	2019-12-09 11:03:00+00	2019-12-09 11:13:00+00	00:10:00	formula	bottle	4	2	ounces
308	2019-12-09 13:00:00+00	2019-12-09 13:14:00+00	00:14:00	formula	bottle	2	2	ounces
309	2019-12-09 13:00:00+00	2019-12-09 13:14:00+00	00:14:00	formula	bottle	3	2	ounces
310	2019-12-09 17:24:00+00	2019-12-09 17:43:00+00	00:19:00	formula	bottle	4	2	ounces
311	2019-12-09 21:42:00+00	2019-12-09 22:55:00+00	01:13:00	formula	bottle	4.5	2	ounces
312	2019-12-10 00:28:00+00	2019-12-10 00:38:00+00	00:10:00	formula	bottle	2	2	ounces
313	2019-12-10 00:28:00+00	2019-12-10 00:38:00+00	00:10:00	formula	bottle	2	2	ounces
314	2019-12-10 02:31:00+00	2019-12-10 03:00:00+00	00:29:00	formula	bottle	4	2	ounces
315	2019-12-10 05:31:00+00	2019-12-10 05:45:00+00	00:14:00	formula	bottle	3.5	2	ounces
316	2019-12-10 08:56:00+00	2019-12-10 09:11:00+00	00:15:00	formula	bottle	4	2	ounces
317	2019-12-10 11:29:00+00	2019-12-10 11:45:00+00	00:16:00	formula	bottle	3	2	ounces
318	2019-12-10 14:07:00+00	2019-12-10 14:24:00+00	00:17:00	formula	bottle	3.5	2	ounces
319	2019-12-10 15:58:00+00	2019-12-10 16:20:00+00	00:22:00	formula	bottle	2	2	ounces
320	2019-12-10 18:18:00+00	2019-12-10 18:33:00+00	00:15:00	formula	bottle	4	2	ounces
321	2019-12-10 21:37:00+00	2019-12-10 22:02:00+00	00:25:00	formula	bottle	5	2	ounces
322	2019-12-11 00:40:00+00	2019-12-11 01:23:00+00	00:43:00	formula	bottle	4.5	2	ounces
323	2019-12-11 03:08:00+00	2019-12-11 03:30:00+00	00:22:00	formula	bottle	4	2	ounces
324	2019-12-11 08:35:00+00	2019-12-11 09:01:00+00	00:26:00	formula	bottle	4	2	ounces
325	2019-12-11 12:10:00+00	2019-12-11 12:16:00+00	00:06:00	formula	bottle	3.5	2	ounces
326	2019-12-11 15:10:00+00	2019-12-11 15:29:00+00	00:19:00	formula	bottle	4	2	ounces
327	2019-12-11 18:10:00+00	2019-12-11 18:32:00+00	00:22:00	formula	bottle	4	2	ounces
328	2019-12-11 21:48:00+00	2019-12-11 22:23:00+00	00:35:00	formula	bottle	5	2	ounces
329	2019-12-12 01:14:00+00	2019-12-12 01:28:00+00	00:14:00	formula	bottle	4	2	ounces
330	2019-12-12 04:09:00+00	2019-12-12 04:28:00+00	00:19:00	formula	bottle	3.5	2	ounces
\.


--
-- Data for Name: core_note; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_note (id, note, "time", child_id) FROM stdin;
1	Crazy Maisie was not happy this morning :(	2019-12-09 13:53:47.200541+00	4
\.


--
-- Data for Name: core_notification; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_notification (id, title, body, url, frequency_hours, intervals, active, start, "end", account_id, user_id, child_id) FROM stdin;
1	Test Notification	This is the first test notification	\N	1	3	t	2019-11-03 22:17:00+00	2019-11-04 01:17:00+00	2	2	1
\.


--
-- Data for Name: core_notificationevent; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_notificationevent (id, acknowledged, acknowledged_type, url, notification_id, user_id, send_at, sent) FROM stdin;
1	f		\N	1	2	2019-11-03 22:17:00+00	t
2	f		\N	1	2	2019-11-03 23:17:00+00	t
3	f		\N	1	2	2019-11-04 00:17:00+00	t
\.


--
-- Data for Name: core_sleep; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_sleep (id, start, "end", duration, child_id) FROM stdin;
1	2019-11-03 18:30:00+00	2019-11-03 20:00:00+00	01:30:00	1
2	2019-11-08 16:10:39.604527+00	2019-11-08 17:07:31.714063+00	00:56:52.109536	2
3	2019-11-09 21:35:00+00	2019-11-09 22:35:00+00	01:00:00	2
4	2019-11-10 01:23:23.143666+00	2019-11-10 03:09:29.778599+00	01:46:06.634933	2
5	2019-11-10 03:30:00+00	2019-11-10 06:27:00+00	02:57:00	2
6	2019-11-10 13:30:00+00	2019-11-10 14:10:00+00	00:40:00	2
7	2019-11-10 17:31:51.226817+00	2019-11-10 18:14:36.002846+00	00:42:44.776029	2
8	2019-11-11 03:20:00+00	2019-11-11 05:50:00+00	02:30:00	2
9	2019-11-11 06:49:06.387954+00	2019-11-11 10:30:36.09823+00	03:41:29.710276	2
10	2019-11-11 16:00:00+00	2019-11-11 18:27:00+00	02:27:00	2
12	2019-11-11 20:20:00+00	2019-11-11 22:15:00+00	01:55:00	2
13	2019-11-11 23:32:50.243522+00	2019-11-12 01:21:26.736905+00	01:48:36.493383	2
14	2019-11-12 05:21:00+00	2019-11-12 07:21:00+00	02:00:00	2
15	2019-11-12 21:38:29.24197+00	2019-11-12 22:25:18.755551+00	00:46:49.513581	2
16	2019-11-13 01:30:00+00	2019-11-13 03:15:00+00	01:45:00	2
17	2019-11-13 04:10:00+00	2019-11-13 05:56:00+00	01:46:00	2
18	2019-11-13 07:38:18.466346+00	2019-11-13 10:39:34.908307+00	03:01:16.441961	2
19	2019-11-14 08:01:31.129505+00	2019-11-14 08:20:40.571277+00	00:19:09.441772	2
20	2019-11-14 13:31:12.035669+00	2019-11-14 14:15:11.11199+00	00:43:59.076321	2
21	2019-11-14 19:12:00+00	2019-11-14 21:31:00+00	02:19:00	2
22	2019-11-14 23:06:53.586562+00	2019-11-15 00:05:28.933466+00	00:58:35.346904	2
23	2019-11-15 10:06:24.474482+00	2019-11-15 13:42:19.607105+00	03:35:55.132623	2
24	2019-11-15 19:13:23.129536+00	2019-11-15 19:35:53.367717+00	00:22:30.238181	2
25	2019-11-15 21:04:51.98822+00	2019-11-15 23:24:42.410524+00	02:19:50.422304	2
26	2019-11-16 04:32:00+00	2019-11-16 06:32:00+00	02:00:00	2
27	2019-11-16 10:39:00+00	2019-11-16 13:39:00+00	03:00:00	2
29	2019-11-17 08:45:35.899799+00	2019-11-17 11:25:04.969305+00	02:39:29.069506	2
30	2019-11-17 15:46:23.150701+00	2019-11-17 16:19:33.205283+00	00:33:10.054582	2
32	2019-11-17 19:09:37.351471+00	2019-11-17 21:15:04.741852+00	02:05:27.390381	2
33	2019-11-18 04:31:00+00	2019-11-18 06:00:00+00	01:29:00	2
34	2019-11-18 06:08:49.152649+00	2019-11-18 07:45:29.123446+00	01:36:39.970797	2
35	2019-11-18 08:06:44.243629+00	2019-11-18 10:46:20.959846+00	02:39:36.716217	2
36	2019-11-18 11:08:00+00	2019-11-18 13:02:00+00	01:54:00	2
37	2019-11-21 05:58:00+00	2019-11-21 08:10:00+00	02:12:00	2
38	2019-11-21 21:43:36.804816+00	2019-11-21 22:09:48.543057+00	00:26:11.738241	2
39	2019-11-22 01:45:00+00	2019-11-22 03:25:00+00	01:40:00	2
40	2019-11-22 03:51:00+00	2019-11-22 07:42:00+00	03:51:00	2
41	2019-11-22 08:30:00+00	2019-11-22 10:15:00+00	01:45:00	2
42	2019-11-22 19:40:00+00	2019-11-22 22:24:00+00	02:44:00	2
43	2019-11-23 04:13:57.107637+00	2019-11-23 06:07:18.396102+00	01:53:21.288465	2
44	2019-11-23 07:00:00+00	2019-11-23 09:05:00+00	02:05:00	2
45	2019-11-23 15:53:49.222499+00	2019-11-23 16:33:55.4762+00	00:40:06.253701	2
46	2019-11-24 04:40:00+00	2019-11-24 06:58:00+00	02:18:00	2
47	2019-11-24 13:50:52.432019+00	2019-11-24 14:12:28.373855+00	00:21:35.941836	2
76	2019-11-30 04:09:47.814482+00	2019-11-30 06:37:09.534299+00	02:27:21.719817	2
77	2019-11-30 07:04:38.586211+00	2019-11-30 09:37:24.266553+00	02:32:45.680342	2
78	2019-11-30 09:54:45.419645+00	2019-11-30 10:18:40.777208+00	00:23:55.357563	2
79	2019-11-30 10:28:00+00	2019-11-30 11:29:00+00	01:01:00	2
48	2019-11-24 14:45:00+00	2019-11-24 16:15:00+00	01:30:00	2
50	2019-11-25 04:04:12.049601+00	2019-11-25 06:05:17.126684+00	02:01:05.077083	2
51	2019-11-25 06:42:51.345751+00	2019-11-25 09:25:31.502794+00	02:42:40.157043	2
80	2019-11-30 13:28:14.667338+00	2019-11-30 14:10:15.234113+00	00:42:00.566775	2
52	2019-11-25 10:02:00+00	2019-11-25 13:04:00+00	03:02:00	2
53	2019-11-25 14:28:00+00	2019-11-25 16:45:00+00	02:17:00	2
54	2019-11-25 20:45:00+00	2019-11-25 23:29:00+00	02:44:00	2
56	2019-11-26 04:26:21.535919+00	2019-11-26 07:06:40.148323+00	02:40:18.612404	2
58	2019-11-26 19:36:00+00	2019-11-26 21:37:00+00	02:01:00	2
59	2019-11-27 03:55:17.385022+00	2019-11-27 06:57:21.22588+00	03:02:03.840858	2
60	2019-11-27 08:32:46.502011+00	2019-11-27 10:23:56.345303+00	01:51:09.843292	2
62	2019-11-28 05:07:31.856357+00	2019-11-28 07:46:51.980411+00	02:39:20.124054	2
63	2019-11-28 08:06:19.848259+00	2019-11-28 10:46:58.113185+00	02:40:38.264926	2
64	2019-11-28 11:07:17.950883+00	2019-11-28 13:38:16.361679+00	02:30:58.410796	2
65	2019-11-28 16:20:00+00	2019-11-28 17:20:00+00	01:00:00	2
66	2019-11-28 18:20:00+00	2019-11-28 18:59:00+00	00:39:00	2
67	2019-11-28 20:00:00+00	2019-11-28 21:00:00+00	01:00:00	2
68	2019-11-28 22:15:00+00	2019-11-28 23:25:00+00	01:10:00	2
55	2019-11-26 02:29:00+00	2019-11-26 03:39:00+00	01:10:00	2
81	2019-11-30 18:05:11.431382+00	2019-11-30 21:05:22.878378+00	03:00:11.446996	2
61	2019-11-27 10:34:00+00	2019-11-27 11:46:00+00	01:12:00	2
69	2019-11-29 03:28:29.17562+00	2019-11-29 06:40:49.62857+00	03:12:20.45295	2
70	2019-11-29 07:00:27.542007+00	2019-11-29 09:46:46.406835+00	02:46:18.864828	2
71	2019-11-29 10:11:58.82042+00	2019-11-29 10:37:18.952003+00	00:25:20.131583	2
57	2019-11-26 07:19:00+00	2019-11-26 08:35:00+00	01:16:00	2
73	2019-11-28 01:30:00+00	2019-11-28 03:15:00+00	01:45:00	2
74	2019-11-27 14:30:00+00	2019-11-27 15:35:00+00	01:05:00	2
75	2019-11-29 17:14:35.382014+00	2019-11-29 18:38:24.298179+00	01:23:48.916165	2
82	2019-11-30 23:34:57.477546+00	2019-12-01 03:29:02.305882+00	03:54:04.828336	2
83	2019-12-01 04:12:31.007874+00	2019-12-01 05:59:26.452893+00	01:46:55.445019	2
84	2019-12-01 08:14:51.637058+00	2019-12-01 10:23:40.286513+00	02:08:48.649455	2
85	2019-12-01 11:00:00+00	2019-12-01 12:50:00+00	01:50:00	2
86	2019-12-01 15:25:00+00	2019-12-01 16:26:00+00	01:01:00	2
87	2019-12-01 18:30:00+00	2019-12-01 20:44:00+00	02:14:00	2
88	2019-12-02 04:46:00+00	2019-12-02 06:15:00+00	01:29:00	2
89	2019-12-02 07:22:20.527375+00	2019-12-02 09:43:52.018704+00	02:21:31.491329	2
90	2019-12-02 10:05:00+00	2019-12-02 10:30:00+00	00:25:00	2
91	2019-12-02 10:55:23.836551+00	2019-12-02 13:01:44.485342+00	02:06:20.648791	2
92	2019-12-02 15:12:08.793283+00	2019-12-02 15:18:14.317629+00	00:06:05.524346	2
93	2019-12-02 18:00:57.462531+00	2019-12-02 21:22:58.668461+00	03:22:01.20593	2
94	2019-12-03 03:14:45.054485+00	2019-12-03 06:12:55.926299+00	02:58:10.871814	2
95	2019-12-03 06:35:00+00	2019-12-03 09:46:00+00	03:11:00	2
96	2019-12-04 00:06:00+00	2019-12-04 01:08:00+00	01:02:00	2
97	2019-12-04 04:02:10.579862+00	2019-12-04 06:09:31.986751+00	02:07:21.406889	2
98	2019-12-04 07:07:00+00	2019-12-04 09:31:00+00	02:24:00	2
99	2019-12-04 18:30:56.594207+00	2019-12-04 21:29:02.771896+00	02:58:06.177689	2
100	2019-12-05 04:17:08.028714+00	2019-12-05 07:01:59.000421+00	02:44:50.971707	2
101	2019-12-05 07:20:56.042777+00	2019-12-05 10:34:25.898946+00	03:13:29.856169	2
102	2019-12-05 19:12:07.017132+00	2019-12-05 20:08:34.236612+00	00:56:27.21948	2
103	2019-12-06 04:44:37.278128+00	2019-12-06 05:49:49.405872+00	01:05:12.127744	2
104	2019-12-06 07:38:00+00	2019-12-06 10:35:00+00	02:57:00	2
105	2019-12-06 10:59:34.360558+00	2019-12-06 13:54:51.412329+00	02:55:17.051771	2
106	2019-12-07 04:18:00.320445+00	2019-12-07 07:25:58.197093+00	03:07:57.876648	2
107	2019-12-07 17:05:00+00	2019-12-07 18:04:00+00	00:59:00	2
108	2019-12-07 21:00:00+00	2019-12-07 23:30:00+00	02:30:00	2
109	2019-12-08 04:24:35.894623+00	2019-12-08 06:19:49.192549+00	01:55:13.297926	2
110	2019-12-08 08:00:00+00	2019-12-08 10:00:00+00	02:00:00	2
111	2019-12-08 15:11:20.427673+00	2019-12-08 15:41:19.298152+00	00:29:58.870479	2
112	2019-12-08 17:00:00+00	2019-12-08 19:36:00+00	02:36:00	2
113	2019-12-09 04:00:00+00	2019-12-09 06:15:00+00	02:15:00	2
114	2019-12-09 18:45:00+00	2019-12-09 21:28:00+00	02:43:00	2
118	2019-12-09 08:05:00+00	2019-12-09 10:06:00+00	02:01:00	2
119	2019-12-10 04:34:19.685656+00	2019-12-10 05:20:49.09464+00	00:46:29.408984	2
120	2019-12-10 06:52:17.883281+00	2019-12-10 08:56:25.627998+00	02:04:07.744717	2
121	2019-12-10 09:12:00+00	2019-12-10 11:26:00+00	02:14:00	2
122	2019-12-10 18:34:00+00	2019-12-10 21:35:00+00	03:01:00	2
123	2019-12-11 04:21:19.406316+00	2019-12-11 08:34:44.673324+00	04:13:25.267008	2
124	2019-12-11 13:07:00+00	2019-12-11 15:09:00+00	02:02:00	2
125	2019-12-11 19:09:00+00	2019-12-11 21:11:00+00	02:02:00	2
126	2019-12-11 16:25:00+00	2019-12-11 17:40:00+00	01:15:00	2
127	2019-12-12 03:06:07.385981+00	2019-12-12 04:06:01.956517+00	00:59:54.570536	2
\.


--
-- Data for Name: core_suggestion; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_suggestion (id, diaper_change, feeding, sleep, temperature_check, tummy_time, quantity, units, send_text_notification, send_email_notification, send_app_notification, send_at, sent, child_id, user_id) FROM stdin;
\.


--
-- Data for Name: core_temperature; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_temperature (id, temperature, "time", child_id) FROM stdin;
1	97.7000000000000028	2019-11-09 14:01:00+00	2
2	100	2019-12-07 14:09:00+00	4
\.


--
-- Data for Name: core_timer; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_timer (id, name, start, "end", duration, active, user_id, account_id, child_id, is_feeding, is_sleeping, is_tummytime, complete, created) FROM stdin;
29	Timer #29	2019-11-10 00:20:42.746784+00	2019-11-10 00:20:42.764878+00	00:26:54.385659	f	3	3	2	t	f	f	t	2019-11-09 23:53:48.308869+00
21	Timer #21	2019-11-08 19:08:04.38645+00	2019-11-08 19:08:04.405189+00	00:01:02.135408	f	4	3	2	f	f	t	t	2019-11-08 19:06:57.3073+00
11	Timer #11	2019-11-08 01:20:11+00	\N	01:34:08.751597	f	3	3	2	t	f	f	t	2019-11-07 23:46:27.161471+00
23	Timer #23	2019-11-09 00:14:09.36625+00	2019-11-09 00:14:09.383607+00	00:28:58.858626	f	4	3	2	t	f	f	t	2019-11-08 23:45:06.956579+00
73	Timer #73	2019-11-14 08:34:25.439852+00	2019-11-14 08:34:25.457494+00	00:13:38.2629	f	4	3	2	t	f	f	t	2019-11-14 08:20:47.137827+00
26	Timer #26	2019-11-09 13:25:34.375857+00	2019-11-09 13:25:34.377773+00	00:00:02.868448	f	4	3	2	t	f	f	t	2019-11-09 13:25:11.386207+00
19	Timer #19	2019-11-08 17:07:31.711764+00	2019-11-08 17:07:31.714063+00	00:56:52.109536	f	3	3	2	f	t	f	t	2019-11-08 16:10:34.541998+00
15	Timer #15	\N	\N	\N	f	4	4	\N	f	f	f	t	2019-11-08 01:41:18.532202+00
16	Timer #16	2019-11-08 01:49:56.383798+00	2019-11-08 01:49:56.398492+00	00:08:14.500792	f	4	3	2	t	f	f	t	2019-11-08 01:41:37.074316+00
1	Timer #1	\N	\N	\N	f	1	1	\N	f	f	f	t	2019-11-03 04:54:30.284634+00
37	Timer #37	2019-11-10 12:54:51.648849+00	2019-11-10 12:54:51.65072+00	00:27:05.863131	f	4	3	2	t	f	f	t	2019-11-10 12:27:45.753632+00
46	Timer #46	2019-11-11 10:30:36.095365+00	2019-11-11 10:30:36.09823+00	03:41:29.710276	f	4	3	2	f	t	f	t	2019-11-11 06:49:06.36671+00
35	Timer #35	2019-11-10 13:58:35.518802+00	2019-11-10 13:58:35.538774+00	01:32:19.031516	f	4	3	2	f	f	f	t	2019-11-10 12:26:16.42814+00
17	Timer #17	2019-11-08 12:32:25.959881+00	2019-11-08 12:32:25.976369+00	00:03:20.249525	f	4	3	2	t	f	f	t	2019-11-08 12:29:02.625602+00
4	Timer #4	\N	\N	\N	f	2	2	\N	f	f	f	t	2019-11-04 00:29:17.410547+00
24	Timer #24	2019-11-09 04:39:42.394316+00	2019-11-09 04:39:42.410391+00	00:47:48.281685	f	4	3	2	t	f	f	t	2019-11-09 03:51:49.956478+00
76	Timer #76	2019-11-14 18:46:30.008105+00	2019-11-14 18:46:30.024496+00	01:04:03.533692	f	4	3	2	f	f	f	t	2019-11-14 17:42:26.451057+00
13	Timer #13	2019-11-08 00:51:02.445184+00	2019-11-08 00:51:02.448327+00	00:15:20.44381	f	4	3	2	t	f	f	t	2019-11-08 00:35:38.424447+00
12	Timer #12	2019-11-08 00:11:53.878539+00	2019-11-08 00:11:53.880884+00	00:10:10.319147	f	4	3	2	t	f	f	t	2019-11-07 23:55:55.335448+00
10	Timer #10	2019-11-07 23:36:50.3105+00	2019-11-07 23:36:50.325499+00	00:22:05.389166	f	4	3	2	t	f	f	t	2019-11-07 23:14:40.117203+00
9	Timer #9	2019-11-06 23:54:45.33892+00	2019-11-06 23:54:45.341715+00	01:26:20.329699	f	3	3	2	f	f	f	t	2019-11-06 22:28:12.847936+00
8	Timer #8	2019-11-05 15:23:42.518183+00	2019-11-05 15:23:42.521086+00	00:17:12.722278	f	3	3	2	t	f	f	t	2019-11-05 15:06:24.144718+00
34	Timer #34	2019-11-10 08:34:19.303067+00	2019-11-10 08:34:19.321181+00	00:00:01.757728	f	4	3	2	t	f	f	t	2019-11-10 08:34:17.55773+00
7	Timer #7	2019-11-04 01:22:25.526169+00	2019-11-04 01:22:25.528305+00	00:24:05.502635	f	2	2	1	t	f	f	t	2019-11-04 00:57:58.843529+00
72	Timer #72	2019-11-14 08:20:40.569373+00	2019-11-14 08:20:40.571277+00	00:19:09.441772	f	4	3	2	f	t	f	t	2019-11-14 08:01:31.109401+00
71	Timer #71	2019-11-14 08:01:01.535456+00	2019-11-14 08:01:01.552961+00	00:28:24.25826	f	4	3	2	t	f	f	t	2019-11-14 07:32:37.247785+00
32	Timer #32	2019-11-10 03:56:03.440196+00	2019-11-10 03:56:03.457823+00	00:00:19.471296	f	3	3	2	t	f	f	t	2019-11-10 03:55:43.979704+00
20	Timer #20	2019-11-08 19:00:40.915124+00	2019-11-08 19:00:40.931862+00	00:21:46.128191	f	4	3	2	t	f	f	t	2019-11-08 18:38:48.15053+00
6	Timer #6	2019-11-04 00:46:08.278585+00	2019-11-04 00:46:08.291719+00	00:01:34.929457	f	2	2	\N	t	f	f	t	2019-11-04 00:44:29.695296+00
5	Timer #5	2019-11-04 00:42:26.555094+00	2019-11-04 00:42:26.571723+00	00:00:07.494501	f	2	2	1	t	f	f	t	2019-11-04 00:41:28.610227+00
3	Timer #3	2019-11-04 00:34:20.371757+00	2019-11-04 00:34:20.388807+00	00:06:52.254412	f	2	2	1	f	t	f	t	2019-11-04 00:27:02.962111+00
2	Timer #2	2019-11-03 23:15:24.425857+00	2019-11-03 23:15:24.442194+00	00:23:36.147419	f	2	2	1	f	f	f	t	2019-11-03 22:24:10.647499+00
70	Timer #70	2019-11-14 01:36:10.328606+00	2019-11-14 01:36:10.332105+00	00:42:04.332498	f	4	3	2	t	f	f	t	2019-11-14 00:54:05.969403+00
52	Timer #52	2019-11-12 04:33:19.270482+00	2019-11-12 04:33:19.273648+00	00:01:02.865076	f	3	3	2	t	f	f	t	2019-11-12 04:32:16.401131+00
25	Timer #25	2019-11-09 08:29:41.941841+00	2019-11-09 08:29:41.943923+00	00:00:02.102315	f	4	3	2	t	f	f	t	2019-11-09 08:29:35.698271+00
22	Timer #22	2019-11-08 22:21:05.271435+00	2019-11-08 22:21:05.289445+00	00:13:39.920574	f	3	3	2	t	f	f	t	2019-11-08 21:59:00.713897+00
14	Timer #14	2019-11-08 01:10:04.050713+00	2019-11-08 01:10:04.078426+00	00:16:24.817197	f	4	3	2	t	f	f	t	2019-11-08 00:53:34.639471+00
69	Timer #69	2019-11-13 23:35:02.662715+00	2019-11-13 23:35:02.721111+00	00:23:51.301997	f	4	3	2	t	f	f	t	2019-11-13 23:11:11.389836+00
68	Timer #68	2019-11-13 19:57:56.165026+00	2019-11-13 19:57:56.168074+00	00:33:19.193357	f	4	3	2	t	f	f	t	2019-11-13 19:24:36.94672+00
67	Timer #67	2019-11-13 13:50:33.298515+00	2019-11-13 13:50:33.317208+00	00:35:35.688958	f	3	3	2	t	f	f	t	2019-11-13 13:14:57.507381+00
66	Timer #66	2019-11-13 11:08:11.545304+00	2019-11-13 11:08:11.547733+00	00:28:26.541093	f	4	3	2	t	f	f	t	2019-11-13 10:39:44.98583+00
45	Timer #45	2019-11-11 06:47:01.508646+00	2019-11-11 06:47:01.525676+00	00:47:22.273782	f	3	3	2	t	f	f	t	2019-11-11 05:59:39.188284+00
28	Timer #28	2019-11-09 20:02:39.976086+00	2019-11-09 20:02:39.994383+00	00:00:03.220626	f	4	3	2	t	f	f	t	2019-11-09 20:02:32.392474+00
39	Timer #39	2019-11-10 15:22:59.936965+00	2019-11-10 15:22:59.952918+00	00:19:20.865469	f	4	3	2	t	f	f	t	2019-11-10 15:03:39.041469+00
33	Timer #33	2019-11-10 08:16:02.808845+00	2019-11-10 08:16:02.826563+00	00:29:50.267324	f	4	3	2	t	f	f	t	2019-11-10 07:46:12.537827+00
18	Timer #18	2019-11-08 16:01:02.127103+00	2019-11-08 16:01:02.129525+00	00:01:09.049593	f	3	3	2	t	f	f	t	2019-11-08 15:59:40.293777+00
65	Timer #65	2019-11-13 10:39:34.905275+00	2019-11-13 10:39:34.908307+00	03:01:16.441961	f	4	3	2	f	t	f	t	2019-11-13 07:38:18.428807+00
42	Timer #42	2019-11-11 00:32:08.038419+00	2019-11-11 00:32:08.040694+00	06:16:32.178164	f	3	3	2	f	f	f	t	2019-11-10 18:15:35.590416+00
30	Timer #30	2019-11-10 00:57:45.031719+00	2019-11-10 00:57:45.034938+00	00:00:02.485328	f	4	3	2	t	f	f	t	2019-11-10 00:57:42.540705+00
64	Timer #64	2019-11-13 07:28:46.287601+00	2019-11-13 07:28:46.289766+00	00:24:52.870024	f	4	3	2	t	f	f	t	2019-11-13 07:03:53.383972+00
38	Nap	2019-11-10 14:58:39.424728+00	2019-11-10 14:58:39.441505+00	00:58:35.725457	f	3	3	2	f	t	f	t	2019-11-10 14:00:03.593501+00
36	Timer #36	2019-11-10 13:58:19.974765+00	2019-11-10 13:58:19.977057+00	01:30:45.174767	f	4	3	2	f	f	f	t	2019-11-10 12:27:34.74724+00
27	Timer #27	2019-11-09 22:48:06.009908+00	2019-11-09 22:48:06.028495+00	05:54:59.428922	f	4	3	2	t	f	f	t	2019-11-09 16:53:02.900892+00
31	Timer #31	2019-11-10 03:09:29.776688+00	2019-11-10 03:09:29.778599+00	01:46:06.634933	f	3	3	2	f	t	f	t	2019-11-10 01:23:23.07296+00
43	Timer #43	2019-11-10 21:43:32.901353+00	2019-11-10 21:43:32.921057+00	00:38:14.881768	f	4	3	2	t	f	f	t	2019-11-10 21:05:18.011052+00
58	Timer #58	2019-11-12 22:25:18.738113+00	2019-11-12 22:25:18.755678+00	00:46:49.515517	f	4	3	2	f	t	f	t	2019-11-12 21:38:29.107353+00
53	Timer #53	2019-11-12 08:05:15.864434+00	2019-11-12 08:05:15.880177+00	00:25:40.443327	f	4	3	2	t	f	f	t	2019-11-12 07:39:35.405689+00
40	Feeding	2019-11-10 17:31:27.077076+00	2019-11-10 17:31:27.079921+00	00:24:55.246431	f	3	3	2	t	f	f	t	2019-11-10 17:06:31.807401+00
51	Sleeping	2019-11-12 01:21:26.734815+00	2019-11-12 01:21:26.736905+00	01:48:36.493383	f	3	3	2	f	t	f	t	2019-11-11 23:32:50.078185+00
60	Timer #60	2019-11-12 23:48:31.40716+00	2019-11-12 23:48:31.431534+00	00:00:01.798312	f	4	3	2	t	f	f	t	2019-11-12 23:48:29.622842+00
41	Timer #41	2019-11-10 18:14:35.99048+00	2019-11-10 18:14:36.009179+00	00:42:44.786888	f	3	3	2	f	t	f	t	2019-11-10 17:31:51.143218+00
54	Timer #54	2019-11-12 12:01:38.193635+00	2019-11-12 12:01:38.196064+00	00:29:06.79889	f	4	3	2	t	f	f	t	2019-11-12 11:32:31.356313+00
44	Timer #44	2019-11-10 21:52:00.188892+00	2019-11-10 21:52:00.191497+00	00:00:01.8684	f	4	3	2	t	f	f	t	2019-11-10 21:51:58.31156+00
48	Timer #48	2019-11-11 19:10:21.808172+00	2019-11-11 19:10:21.82884+00	00:39:44.787381	f	3	3	2	t	f	f	t	2019-11-11 18:30:36.996024+00
62	Timer #62	2019-11-13 03:53:01.39157+00	2019-11-13 03:53:01.410912+00	00:34:02.126762	f	4	3	2	t	f	f	t	2019-11-13 03:18:59.264047+00
61	Timer #61	2019-11-13 02:44:06.688343+00	2019-11-13 02:44:06.706568+00	02:00:47.218009	f	4	3	2	f	f	f	t	2019-11-13 00:31:35.904512+00
47	Timer #47	2019-11-11 11:10:08.833005+00	2019-11-11 11:10:08.84998+00	00:34:21.554511	f	4	3	2	t	f	f	t	2019-11-11 10:35:47.214578+00
59	Timer #59	2019-11-12 22:45:52.478698+00	2019-11-12 22:45:52.481293+00	00:07:56.944117	f	4	3	2	t	f	f	t	2019-11-12 22:37:55.516617+00
49	Timer #49	2019-11-11 22:33:27.080784+00	2019-11-11 22:33:27.098194+00	02:13:18.916044	f	4	3	2	f	t	f	t	2019-11-11 20:06:41.652583+00
57	Timer #57	2019-11-12 22:23:02.78887+00	2019-11-12 22:23:02.805273+00	04:15:24.580203	f	4	3	2	f	f	f	t	2019-11-12 18:07:38.070478+00
56	Timer #56	2019-11-12 18:06:29.438249+00	2019-11-12 18:06:29.454768+00	00:00:01.072813	f	4	3	2	t	f	f	t	2019-11-12 18:06:28.376557+00
55	Timer #55	2019-11-12 14:39:25.659557+00	2019-11-12 14:39:25.661491+00	00:29:14.598251	f	4	3	2	t	f	f	t	2019-11-12 14:10:11.030918+00
101	Timer #101	2019-11-17 18:33:06.416282+00	2019-11-17 18:33:06.435298+00	00:07:30.184512	f	4	3	2	f	t	f	t	2019-11-17 18:25:36.224971+00
114	Eat	2019-11-18 19:16:01.29326+00	2019-11-18 19:16:01.310553+00	00:23:12.89877	f	4	3	2	t	f	f	t	2019-11-18 18:52:48.392526+00
112	Timer #112	2019-11-18 15:42:58.752744+00	2019-11-18 15:42:58.755593+00	00:02:03.013861	f	4	3	2	f	f	t	t	2019-11-18 15:40:55.720838+00
78	Timer #78	2019-11-14 22:52:52.851608+00	2019-11-14 22:52:52.85444+00	00:43:39.454048	f	4	3	2	t	f	f	t	2019-11-14 22:09:11.181321+00
109	Sleep	2019-11-18 10:46:20.942507+00	2019-11-18 10:46:20.96562+00	02:39:36.724963	f	4	3	2	f	t	f	t	2019-11-18 08:06:44.187764+00
74	Timer #74	2019-11-14 12:52:21.373443+00	2019-11-14 12:52:21.390766+00	00:44:00.843366	f	4	3	2	t	f	f	t	2019-11-14 12:08:20.520359+00
95	Timer #95	2019-11-17 05:25:47.405923+00	2019-11-17 05:25:47.421738+00	00:31:27.546384	f	4	3	2	t	f	f	t	2019-11-17 04:54:19.860264+00
82	Timer #82	2019-11-15 09:53:36.791087+00	2019-11-15 09:53:36.822141+00	00:26:00.138928	f	4	3	2	t	f	f	t	2019-11-15 09:27:36.508679+00
86	Feeding	2019-11-15 20:27:30.172322+00	2019-11-15 20:27:30.189754+00	00:36:49.207927	f	4	3	2	t	f	f	t	2019-11-15 19:50:40.908306+00
92	Timer #92	2019-11-16 14:38:07.570285+00	2019-11-16 14:38:07.57331+00	00:27:00.771864	f	4	3	2	t	f	f	t	2019-11-16 14:11:06.782326+00
124	Timer #124	2019-11-20 03:37:08.365305+00	2019-11-20 03:37:08.367819+00	00:12:40.814251	f	3	3	2	f	f	f	t	2019-11-20 03:24:27.525029+00
77	Timer #77	2019-11-14 19:09:36.812658+00	2019-11-14 19:09:36.818593+00	00:22:53.695876	f	4	3	2	t	f	f	t	2019-11-14 18:46:43.103138+00
131	Timer #131	2019-11-20 22:56:06.134151+00	2019-11-20 22:56:06.15414+00	00:04:16.049302	f	4	3	2	t	f	f	t	2019-11-20 22:51:50.085693+00
116	Eat	2019-11-19 00:18:15.177192+00	2019-11-19 00:18:15.19537+00	00:07:55.040058	f	4	3	2	t	f	f	t	2019-11-19 00:10:20.1366+00
121	Timer #121	2019-11-19 21:27:37.00903+00	2019-11-19 21:27:37.033027+00	00:33:26.250142	f	4	3	2	t	f	f	t	2019-11-19 20:54:10.763018+00
81	Timer #81	2019-11-15 04:24:38.693774+00	2019-11-15 04:24:38.727413+00	01:04:00.202147	f	3	3	2	t	f	f	t	2019-11-15 03:20:38.511972+00
83	Timer #83	2019-11-15 13:42:19.587698+00	2019-11-15 13:42:19.607105+00	03:35:55.132623	f	4	3	2	f	t	f	t	2019-11-15 10:06:24.404333+00
75	Sleep Timer	2019-11-14 14:15:11.092102+00	2019-11-14 14:15:11.11199+00	00:43:59.076321	f	3	3	2	f	t	f	t	2019-11-14 13:31:11.804003+00
97	Timer #97	2019-11-17 11:25:04.953968+00	2019-11-17 11:25:04.969305+00	02:39:29.069506	f	4	3	2	f	t	f	t	2019-11-17 08:45:35.868002+00
93	Timer #93	2019-11-16 23:30:03.782434+00	2019-11-16 23:30:03.784708+00	00:32:09.254976	f	4	3	2	f	t	f	t	2019-11-16 22:57:54.467926+00
87	Timer #87	2019-11-15 23:24:42.408157+00	2019-11-15 23:24:42.410524+00	02:19:50.422304	f	4	3	2	f	t	f	t	2019-11-15 21:04:51.809806+00
120	Timer #120	2019-11-19 18:58:45.22985+00	2019-11-19 18:58:45.232501+00	00:26:05.079784	f	4	3	2	t	f	f	t	2019-11-19 18:32:40.131225+00
108	Timer #108	2019-11-18 08:06:15.626304+00	2019-11-18 08:06:15.641879+00	00:21:06.066013	f	4	3	2	t	f	f	t	2019-11-18 07:45:09.531783+00
85	Sleep	2019-11-15 19:35:53.350529+00	2019-11-15 19:35:53.367717+00	00:22:30.238181	f	4	3	2	f	t	f	t	2019-11-15 19:13:23.0848+00
88	Timer #88	2019-11-16 00:00:49.929079+00	2019-11-16 00:00:49.931944+00	00:35:51.381289	f	4	3	2	t	f	f	t	2019-11-15 23:24:58.521037+00
107	Sleeping	2019-11-18 07:45:29.120979+00	2019-11-18 07:45:29.123446+00	01:36:39.970797	f	3	3	2	f	t	f	t	2019-11-18 06:08:49.114073+00
91	Sleep	2019-11-16 14:39:25.226541+00	2019-11-16 14:39:25.228857+00	03:59:42.78039	f	4	3	2	f	t	f	t	2019-11-16 10:39:42.062641+00
103	Timer #103	2019-11-17 21:15:04.721803+00	2019-11-17 21:15:04.741852+00	02:05:27.390381	f	3	3	2	f	t	f	t	2019-11-17 19:09:37.29201+00
104	Timer #104	2019-11-17 21:39:59.647456+00	2019-11-17 21:39:59.650424+00	00:14:44.161876	f	3	3	2	t	f	f	t	2019-11-17 21:25:15.461074+00
90	Timer #90	2019-11-16 10:39:20.367796+00	2019-11-16 10:39:20.372052+00	00:00:01.603402	f	4	3	2	t	f	f	t	2019-11-16 10:39:18.758572+00
84	Feeding	2019-11-15 14:32:11.185237+00	2019-11-15 14:32:11.200958+00	00:42:00.406224	f	4	3	2	t	f	f	t	2019-11-15 13:50:10.773504+00
89	Timer #89	2019-11-16 07:10:18.213613+00	2019-11-16 07:10:18.230738+00	00:00:01.513273	f	4	3	2	t	f	f	t	2019-11-16 07:10:16.710766+00
127	Timer #127	2019-11-20 13:45:27.179226+00	2019-11-20 13:45:27.181836+00	00:49:24.773866	f	3	3	2	t	f	f	t	2019-11-20 12:56:02.374951+00
111	Timer #111	2019-11-18 14:16:25.439806+00	2019-11-18 14:16:25.441944+00	03:07:43.361719	f	4	3	2	f	t	f	t	2019-11-18 11:08:42.011997+00
115	Eat	2019-11-18 22:38:35.430786+00	2019-11-18 22:38:35.449069+00	00:14:59.516834	f	4	3	2	t	f	f	t	2019-11-18 22:23:35.90897+00
102	Timer #102	2019-11-17 22:51:47.865545+00	2019-11-17 22:51:47.883656+00	02:15:16.590027	f	4	3	2	f	f	f	t	2019-11-17 18:33:12.941993+00
94	Timer #94	2019-11-17 02:06:21.261102+00	2019-11-17 02:06:21.278293+00	00:27:39.856779	f	3	3	2	t	f	f	t	2019-11-17 01:38:41.37351+00
96	Timer #96	2019-11-17 08:37:48.179675+00	2019-11-17 08:37:48.18222+00	00:13:09.159229	f	4	3	2	t	f	f	t	2019-11-17 08:24:39.001525+00
105	Timer #105	2019-11-17 22:51:59.063244+00	2019-11-17 22:51:59.079399+00	00:00:01.753205	f	4	3	2	t	f	f	t	2019-11-17 22:51:57.320755+00
113	Timer #113	2019-11-18 16:51:06.104868+00	2019-11-18 16:51:06.107948+00	00:43:17.16168	f	4	3	2	t	f	f	t	2019-11-18 16:07:48.87596+00
100	Timer #100	2019-11-17 16:35:04.418862+00	2019-11-17 16:35:04.440177+00	00:15:19.197583	f	4	3	2	t	f	f	t	2019-11-17 16:19:45.224926+00
98	Timer #98	2019-11-17 14:50:51.602244+00	2019-11-17 14:50:51.604784+00	00:56:10.552141	f	4	3	2	t	f	f	t	2019-11-17 13:54:41.022209+00
99	Timer #99	2019-11-17 16:19:33.208064+00	2019-11-17 16:19:33.222699+00	00:33:10.069217	f	3	3	2	f	t	f	t	2019-11-17 15:46:23.125281+00
80	Timer #80	2019-11-15 01:37:41.443227+00	2019-11-15 01:37:41.462062+00	00:58:10.594025	f	3	3	2	t	f	f	t	2019-11-15 00:19:17.922469+00
79	Timer #79	2019-11-15 00:05:28.930466+00	2019-11-15 00:05:28.933466+00	00:58:35.346904	f	4	3	2	f	t	f	t	2019-11-14 23:06:53.539747+00
106	Timer #106	2019-11-18 00:36:02.283864+00	2019-11-18 00:36:02.286099+00	00:10:31.28485	f	4	3	2	t	f	f	t	2019-11-18 00:25:30.952821+00
123	Timer #123	2019-11-20 03:07:21.889888+00	2019-11-20 03:07:21.912544+00	00:28:20.97327	f	3	3	2	t	f	f	t	2019-11-20 02:39:00.901675+00
119	Timer #119	2019-11-19 13:41:25.286031+00	2019-11-19 13:41:25.308591+00	00:23:27.52605	f	4	3	2	t	f	f	t	2019-11-19 13:17:57.753967+00
110	Feeding	2019-11-18 11:08:13.536327+00	2019-11-18 11:08:13.541905+00	00:21:31.997302	f	4	3	2	t	f	f	t	2019-11-18 10:46:41.513805+00
130	Timer #130	2019-11-20 21:17:57.647598+00	2019-11-20 21:17:57.650876+00	00:01:04.666057	f	4	3	2	f	f	t	t	2019-11-20 21:16:52.955124+00
118	Timer #118	2019-11-19 11:04:32.530849+00	2019-11-19 11:04:32.548245+00	00:20:10.459781	f	4	3	2	t	f	f	t	2019-11-19 10:44:22.067857+00
135	Timer #135	2019-11-21 12:53:34.498617+00	2019-11-21 12:53:34.519912+00	00:27:24.489976	f	4	3	2	t	f	f	t	2019-11-21 12:26:09.977333+00
117	Timer #117	2019-11-19 08:25:22.148697+00	2019-11-19 08:25:22.162999+00	00:32:29.080251	f	4	3	2	t	f	f	t	2019-11-19 07:52:53.064415+00
129	Timer #129	2019-11-20 20:29:15.372721+00	2019-11-20 20:29:15.37642+00	00:24:45.242136	f	4	3	2	t	f	f	t	2019-11-20 20:04:30.046839+00
122	Timer #122	2019-11-20 00:27:31.674405+00	2019-11-20 00:27:31.697748+00	00:01:09.875257	f	4	3	2	f	f	t	t	2019-11-20 00:26:21.801682+00
128	Timer #128	2019-11-20 16:13:59.6163+00	2019-11-20 16:13:59.639804+00	00:06:08.625307	f	4	3	2	t	f	f	t	2019-11-20 16:07:50.994946+00
126	Timer #126	2019-11-20 10:55:09.75886+00	2019-11-20 10:55:09.782081+00	00:25:26.96336	f	4	3	2	t	f	f	t	2019-11-20 10:29:42.799141+00
125	Timer #125	2019-11-20 05:57:14.527069+00	2019-11-20 05:57:14.547792+00	00:09:07.078987	f	3	3	2	f	f	f	t	2019-11-20 05:48:07.425189+00
132	Timer #132	2019-11-21 04:17:54.161485+00	2019-11-21 04:17:54.164937+00	00:20:34.918205	f	3	3	2	t	f	f	t	2019-11-21 03:57:19.219973+00
134	Timer #134	2019-11-21 08:33:41.700657+00	2019-11-21 08:33:41.703724+00	00:19:46.195034	f	4	3	2	t	f	f	t	2019-11-21 08:13:55.485663+00
136	Timer #136	2019-11-21 17:00:58.87205+00	2019-11-21 17:00:58.87515+00	00:18:51.199201	f	4	3	2	t	f	f	t	2019-11-21 16:42:07.615235+00
137	Timer #137	2019-11-21 22:09:48.539724+00	2019-11-21 22:09:48.543057+00	00:26:11.738241	f	4	3	2	f	t	f	t	2019-11-21 21:43:36.775994+00
138	Timer #138	2019-11-21 22:31:32.426286+00	2019-11-21 22:31:32.44463+00	00:15:29.335994	f	4	3	2	t	f	f	t	2019-11-21 22:16:03.088186+00
139	Timer #139	2019-11-21 23:37:27.080163+00	2019-11-21 23:37:27.103124+00	00:04:01.55042	f	4	3	2	t	f	f	t	2019-11-21 23:33:25.528094+00
133	Sleeping	2019-11-21 12:33:47.14899+00	2019-11-21 12:33:47.160918+00	06:35:08.330455	f	3	3	2	f	t	f	t	2019-11-21 05:58:38.468353+00
140	Feeding	2019-11-22 03:51:34.992219+00	2019-11-22 03:51:34.995149+00	00:22:06.585846	f	3	3	2	t	f	f	t	2019-11-22 03:29:28.29902+00
142	Timer #142	2019-11-22 10:42:00.374115+00	2019-11-22 10:42:00.391907+00	00:22:28.357505	f	4	3	2	t	f	f	t	2019-11-22 10:19:31.9935+00
141	Timer #141	2019-11-22 10:42:18.286799+00	2019-11-22 10:42:18.307381+00	06:50:28.151636	f	3	3	2	f	t	f	t	2019-11-22 03:51:50.036057+00
143	Timer #143	2019-11-22 18:18:37.88164+00	2019-11-22 18:18:37.884989+00	03:23:15.512062	f	4	3	2	f	f	f	t	2019-11-22 14:55:22.271152+00
144	Timer #144	2019-11-22 19:04:14.471118+00	2019-11-22 19:04:14.474821+00	00:14:19.473531	f	4	3	2	t	f	f	t	2019-11-22 18:49:54.971408+00
145	Timer #145	2019-11-22 22:42:13.081728+00	2019-11-22 22:42:13.086618+00	03:02:10.019326	f	4	3	2	f	t	f	t	2019-11-22 19:40:02.923584+00
150	Eat	2019-11-23 09:35:10.519387+00	2019-11-23 09:35:10.539797+00	00:21:38.679309	f	4	3	2	t	f	f	t	2019-11-23 09:13:31.782075+00
179	Timer #179	2019-11-26 03:34:57.197322+00	2019-11-26 03:34:57.23077+00	00:37:55.98658	f	3	3	2	f	t	f	t	2019-11-26 02:57:01.157584+00
181	Timer #181	2019-11-26 07:06:40.12602+00	2019-11-26 07:06:40.148323+00	02:40:18.612404	f	3	3	2	f	t	f	t	2019-11-26 04:26:21.446375+00
173	Timer #173	2019-11-25 13:04:59.854473+00	2019-11-25 13:04:59.906713+00	00:17:25.59305	f	3	3	2	f	t	f	t	2019-11-25 12:47:34.230343+00
165	Timer #165	2019-11-24 19:42:44.853445+00	2019-11-24 19:42:44.874868+00	00:24:22.122807	f	3	3	2	t	f	f	t	2019-11-24 19:18:22.718483+00
189	Timer #189	2019-11-27 00:46:39.17295+00	2019-11-27 00:46:39.192791+00	00:10:55.961295	f	3	3	2	t	f	f	t	2019-11-27 00:35:43.144626+00
175	Timer #175	2019-11-25 17:12:36.01712+00	2019-11-25 17:12:36.040216+00	02:43:50.981906	f	4	3	2	f	t	f	t	2019-11-25 14:28:44.767371+00
161	Timer #161	2019-11-24 14:12:28.353716+00	2019-11-24 14:12:28.373855+00	00:21:35.941836	f	3	3	2	f	t	f	t	2019-11-24 13:50:52.358901+00
184	Timer #184	2019-11-26 11:25:08.203568+00	2019-11-26 11:25:08.257441+00	00:00:00.776364	f	4	3	2	t	f	f	t	2019-11-26 11:25:07.473682+00
204	Timer #204	2019-11-28 07:46:51.951397+00	2019-11-28 07:46:51.980411+00	02:39:20.124054	f	3	3	2	f	t	f	t	2019-11-28 05:07:31.500782+00
201	Timer #201	2019-11-28 00:52:21.710277+00	2019-11-28 00:52:21.730635+00	00:11:20.442369	f	4	3	2	t	f	f	t	2019-11-28 00:41:01.25886+00
182	Timer #182	2019-11-26 07:30:03.947602+00	2019-11-26 07:30:03.987853+00	00:23:13.995736	f	4	3	2	t	f	f	t	2019-11-26 07:06:49.880317+00
160	Timer #160	2019-11-24 11:38:51.397452+00	2019-11-24 11:38:51.418435+00	00:00:01.249169	f	4	3	2	t	f	f	t	2019-11-24 11:38:50.162836+00
159	Timer #159	2019-11-24 08:47:54.81223+00	2019-11-24 08:47:54.833116+00	00:00:01.936004	f	4	3	2	t	f	f	t	2019-11-24 08:47:52.890725+00
158	Timer #158	2019-11-24 07:46:12.519939+00	2019-11-24 07:46:12.544336+00	00:41:24.503586	f	4	3	2	t	f	f	t	2019-11-24 07:04:47.942892+00
157	Timer #157	2019-11-24 06:58:16.385043+00	2019-11-24 06:58:16.411675+00	02:39:18.25072	f	3	3	2	f	t	f	t	2019-11-24 04:18:58.062188+00
156	Timer #156	2019-11-24 03:44:34.768931+00	2019-11-24 03:44:34.79197+00	00:23:18.682938	f	3	3	2	t	f	f	t	2019-11-24 03:21:16.078618+00
155	Timer #155	2019-11-24 00:41:14.009642+00	2019-11-24 00:41:14.040127+00	00:53:33.042636	f	3	3	2	t	f	f	t	2019-11-23 23:47:40.917364+00
154	Timer #154	2019-11-23 20:29:42.821426+00	2019-11-23 20:29:42.848219+00	00:06:51.783343	f	4	3	2	t	f	f	t	2019-11-23 20:22:51.038584+00
153	Timer #153	2019-11-23 17:22:05.974679+00	2019-11-23 17:22:06.001883+00	00:30:12.083417	f	4	3	2	t	f	f	t	2019-11-23 16:51:53.795127+00
152	Timer #152	2019-11-23 16:33:55.473528+00	2019-11-23 16:33:55.4762+00	00:40:06.253701	f	3	3	2	f	t	f	t	2019-11-23 15:53:49.154089+00
151	Timer #151	2019-11-23 15:02:50.993712+00	2019-11-23 15:02:51.014505+00	00:35:16.765519	f	4	3	2	t	f	f	t	2019-11-23 14:27:34.211334+00
149	Timer #149	2019-11-23 06:34:23.540576+00	2019-11-23 06:34:23.569413+00	00:19:27.585507	f	3	3	2	t	f	f	t	2019-11-23 06:14:55.899482+00
148	Timer #148	2019-11-23 06:07:18.393103+00	2019-11-23 06:07:18.396102+00	01:53:21.288465	f	3	3	2	f	t	f	t	2019-11-23 04:13:57.085348+00
171	Timer #171	2019-11-25 09:25:31.485244+00	2019-11-25 09:25:31.502794+00	02:42:40.157043	f	4	3	2	f	t	f	t	2019-11-25 06:42:51.312534+00
147	Timer #147	2019-11-23 02:07:10.922029+00	2019-11-23 02:07:10.925647+00	00:20:33.589166	f	3	3	2	t	f	f	t	2019-11-23 01:46:37.25975+00
146	Timer #146	2019-11-23 00:43:43.702349+00	2019-11-23 00:43:43.712103+00	00:02:13.003244	f	4	3	2	f	f	t	t	2019-11-23 00:41:30.636546+00
198	Timer #198	2019-11-27 13:23:49.475908+00	2019-11-27 13:23:49.496129+00	00:04:01.082976	f	3	3	2	f	f	f	t	2019-11-27 13:19:48.324671+00
186	Timer #186	2019-11-26 21:33:55.274635+00	2019-11-26 21:33:55.296782+00	00:02:02.202816	f	4	3	2	f	f	t	t	2019-11-26 21:31:53.073486+00
180	Timer #180	2019-11-26 03:56:53.188685+00	2019-11-26 03:56:53.233328+00	00:18:51.342591	f	3	3	2	t	f	f	t	2019-11-26 03:38:01.546285+00
167	Timer #167	2019-11-25 00:07:47.830977+00	2019-11-25 00:07:47.85063+00	00:19:48.926545	f	4	3	2	t	f	f	t	2019-11-24 23:47:58.875203+00
164	Timer #164	2019-11-24 17:04:57.329493+00	2019-11-24 17:04:57.348707+00	00:13:07.04545	f	3	3	2	t	f	f	t	2019-11-24 16:51:50.226578+00
174	Timer #174	2019-11-25 14:28:07.263502+00	2019-11-25 14:28:07.283818+00	01:17:27.184001	f	4	3	2	t	f	f	t	2019-11-25 13:10:40.07547+00
162	Timer #162	2019-11-24 14:38:00.004107+00	2019-11-24 14:38:00.025726+00	00:25:09.328006	f	3	3	2	t	f	f	t	2019-11-24 14:12:50.664926+00
169	Timer #169	2019-11-25 06:05:17.10232+00	2019-11-25 06:05:17.126684+00	02:01:05.077083	f	3	3	2	f	t	f	t	2019-11-25 03:36:05.377264+00
178	Timer #178	2019-11-26 00:34:03.857001+00	2019-11-26 00:34:03.880639+00	00:01:49.838833	f	4	3	2	f	f	t	t	2019-11-26 00:32:14.000546+00
163	Timer #163	2019-11-24 15:32:14.175065+00	2019-11-24 15:32:14.199081+00	00:00:09.89296	f	3	3	2	f	t	f	t	2019-11-24 15:32:04.298188+00
176	Timer #176	2019-11-25 20:29:41.358877+00	2019-11-25 20:29:41.380246+00	00:28:12.692393	f	4	3	2	t	f	f	t	2019-11-25 20:01:28.646237+00
194	Timer #194	2019-11-27 10:23:56.312187+00	2019-11-27 10:23:56.345303+00	01:51:09.843292	f	4	3	2	f	t	f	t	2019-11-27 08:32:46.475393+00
170	Timer #170	2019-11-25 06:33:02.453384+00	2019-11-25 06:33:02.479176+00	00:26:12.385884	f	3	3	2	t	f	f	t	2019-11-25 06:06:50.002796+00
197	Timer #197	2019-11-27 13:19:18.17832+00	2019-11-27 13:19:18.207228+00	00:16:45.938213	f	4	3	2	t	f	f	t	2019-11-27 13:02:32.196305+00
168	Timer #168	2019-11-25 02:53:25.584767+00	2019-11-25 02:53:25.60617+00	00:12:15.243851	f	3	3	2	t	f	f	t	2019-11-25 02:41:10.342429+00
172	Timer #172	2019-11-25 09:42:00.792003+00	2019-11-25 09:42:00.816275+00	00:16:20.009643	f	4	3	2	t	f	f	t	2019-11-25 09:25:40.788385+00
166	Timer #166	2019-11-24 23:07:22.673668+00	2019-11-24 23:07:22.698504+00	00:21:49.812324	f	4	3	2	f	f	f	t	2019-11-24 21:56:03.211085+00
193	Timer #193	2019-11-27 07:20:04.718723+00	2019-11-27 07:20:04.748407+00	00:22:37.051802	f	4	3	2	t	f	f	t	2019-11-27 06:57:27.665165+00
177	Timer #177	2019-11-25 23:43:58.294791+00	2019-11-25 23:43:58.318257+00	00:14:37.90728	f	3	3	2	t	f	f	t	2019-11-25 23:29:20.318856+00
188	Timer #188	2019-11-26 23:26:13.73198+00	2019-11-26 23:26:13.750737+00	00:13:27.491977	f	4	3	2	t	f	f	t	2019-11-26 23:12:46.158654+00
185	Timer #185	2019-11-26 13:06:25.546299+00	2019-11-26 13:06:25.569452+00	01:40:41.594792	f	4	3	2	f	f	f	t	2019-11-26 11:25:43.94858+00
187	Timer #187	2019-11-26 22:09:50.848363+00	2019-11-26 22:09:50.870057+00	00:35:40.311108	f	4	3	2	t	f	f	t	2019-11-26 21:34:10.447154+00
183	Timer #183	2019-11-26 07:57:38.574952+00	2019-11-26 07:57:38.59552+00	00:27:16.426521	f	4	3	2	f	t	f	t	2019-11-26 07:30:22.147412+00
192	Timer #192	2019-11-27 06:57:21.199493+00	2019-11-27 06:57:21.22588+00	03:02:03.840858	f	3	3	2	f	t	f	t	2019-11-27 03:55:17.335003+00
209	Timer #209	2019-11-28 13:58:40.540311+00	2019-11-28 13:58:40.56077+00	00:04:04.701817	f	4	3	2	f	f	f	t	2019-11-28 13:54:35.82282+00
199	Timer #199	2019-11-27 17:45:20.590492+00	2019-11-27 17:45:20.632799+00	03:40:39.987905	f	3	3	2	f	f	f	t	2019-11-27 14:04:39.904637+00
191	Timer #191	2019-11-27 03:50:43.492754+00	2019-11-27 03:50:43.518801+00	00:25:44.188861	f	3	3	2	t	f	f	t	2019-11-27 03:24:59.234266+00
190	Timer #190	2019-11-27 01:52:19.649884+00	2019-11-27 01:52:19.675308+00	00:12:53.828918	f	3	3	2	t	f	f	t	2019-11-27 01:39:25.809623+00
196	Timer #196	2019-11-27 11:40:21.396296+00	2019-11-27 11:40:21.420289+00	00:57:05.209119	f	4	3	2	f	t	f	t	2019-11-27 10:43:16.165075+00
195	Timer #195	2019-11-27 10:42:35.106463+00	2019-11-27 10:42:35.127754+00	00:18:27.75656	f	4	3	2	t	f	f	t	2019-11-27 10:24:07.325187+00
203	Timer #203	2019-11-28 04:53:53.821752+00	2019-11-28 04:53:53.858489+00	00:08:11.356096	f	3	3	2	t	f	f	t	2019-11-28 04:45:42.4667+00
206	Timer #206	2019-11-28 10:46:58.091195+00	2019-11-28 10:46:58.113185+00	02:40:38.264926	f	4	3	2	f	t	f	t	2019-11-28 08:06:19.824925+00
200	Timer #200	2019-11-27 23:05:22.89792+00	2019-11-27 23:05:22.920986+00	00:23:38.804241	f	4	3	2	t	f	f	t	2019-11-27 22:41:44.096578+00
202	Timer #202	2019-11-28 03:50:40.778377+00	2019-11-28 03:50:40.814318+00	00:21:14.978249	f	3	3	2	t	f	f	t	2019-11-28 03:29:25.796742+00
205	Timer #205	2019-11-28 08:05:58.126378+00	2019-11-28 08:05:58.161377+00	00:18:58.429494	f	4	3	2	t	f	f	t	2019-11-28 07:46:59.635817+00
207	Timer #207	2019-11-28 11:06:22.529282+00	2019-11-28 11:06:22.551354+00	00:19:16.821387	f	4	3	2	t	f	f	t	2019-11-28 10:47:05.709862+00
208	Timer #208	2019-11-28 13:38:16.281776+00	2019-11-28 13:38:16.361679+00	02:30:58.410796	f	4	3	2	f	t	f	t	2019-11-28 11:07:17.795436+00
210	Timer #210	2019-11-28 14:36:18.563905+00	2019-11-28 14:36:18.597348+00	00:37:08.405478	f	4	3	2	t	f	f	t	2019-11-28 13:59:10.1688+00
211	Timer #211	2019-11-28 17:57:57.372233+00	2019-11-28 17:57:57.396586+00	00:30:52.19434	f	3	3	2	t	f	f	t	2019-11-28 17:27:05.09027+00
212	Timer #212	2019-11-28 18:59:44.336711+00	2019-11-28 18:59:44.372134+00	00:12:30.087321	f	3	3	2	f	t	f	t	2019-11-28 18:47:14.127533+00
213	Timer #213	2019-11-28 21:51:01.165275+00	2019-11-28 21:51:01.228526+00	00:37:17.556297	f	4	3	2	t	f	f	t	2019-11-28 21:13:43.612684+00
214	Timer #214	2019-11-29 00:31:10.138374+00	2019-11-29 00:31:10.17697+00	00:29:44.953944	f	4	3	2	t	f	f	t	2019-11-29 00:01:25.159066+00
215	Timer #215	2019-11-29 01:20:17.663444+00	2019-11-29 01:20:17.686617+00	00:01:43.066786	f	4	3	2	f	f	t	t	2019-11-29 01:18:34.591956+00
216	Timer #216	2019-11-29 03:11:22.411945+00	2019-11-29 03:11:22.434222+00	00:38:08.870896	f	3	3	2	t	f	f	t	2019-11-29 02:33:13.535998+00
217	Timer #217	2019-11-29 06:40:49.600089+00	2019-11-29 06:40:49.62857+00	03:12:20.45295	f	3	3	2	f	t	f	t	2019-11-29 03:28:28.904138+00
220	Timer #220	2019-11-29 10:11:22.786545+00	2019-11-29 10:11:22.811013+00	00:23:14.315399	f	4	3	2	t	f	f	t	2019-11-29 09:48:08.465227+00
280	Timer #280	2019-12-03 11:59:26.214767+00	2019-12-03 11:59:26.235858+00	01:47:51.200821	f	4	3	2	f	f	f	t	2019-12-03 10:11:35.009511+00
260	Timer #260	2019-12-02 07:06:02.934665+00	2019-12-02 07:06:02.954862+00	02:19:23.484545	f	3	3	2	f	t	f	t	2019-12-02 04:46:38.789867+00
304	Timer #304	2019-12-06 02:21:51.012533+00	2019-12-06 02:21:51.037472+00	02:46:52.884112	f	4	3	2	t	f	f	t	2019-12-05 23:34:58.02542+00
245	Timer #245	2019-11-30 23:11:55.749596+00	2019-11-30 23:11:55.769092+00	00:02:53.81057	f	3	3	2	f	f	f	t	2019-11-30 23:09:01.836223+00
241	Timer #241	2019-11-30 17:47:34.893815+00	2019-11-30 17:47:34.94464+00	00:18:09.427197	f	3	3	2	f	f	f	t	2019-11-30 17:29:25.398324+00
218	Timer #218	2019-11-29 06:59:58.630822+00	2019-11-29 06:59:58.656312+00	00:18:59.906884	f	4	3	2	t	f	f	t	2019-11-29 06:40:58.717782+00
225	Timer #225	2019-11-29 16:25:05.235802+00	2019-11-29 16:25:05.28646+00	00:29:03.877107	f	4	3	2	t	f	f	t	2019-11-29 15:56:01.378071+00
310	Timer #310	2019-12-06 18:57:52.99474+00	2019-12-06 18:57:53.018471+00	00:00:29.498101	f	3	3	2	t	f	f	t	2019-12-06 18:57:23.455573+00
221	Timer #221	2019-11-29 10:37:18.933321+00	2019-11-29 10:37:18.952003+00	00:25:20.131583	f	4	3	2	f	t	f	t	2019-11-29 10:11:58.800306+00
268	Timer #268	2019-12-02 15:54:43.428229+00	2019-12-02 15:54:43.447129+00	00:30:45.055604	f	4	3	2	t	f	f	t	2019-12-02 15:23:58.363331+00
222	Timer #222	2019-11-29 10:48:21.880987+00	2019-11-29 10:48:21.903077+00	00:00:32.811414	f	4	3	2	f	t	f	t	2019-11-29 10:47:49.084808+00
254	Timer #254	2019-12-01 14:14:14.858168+00	2019-12-01 14:14:14.87986+00	00:11:03.922995	f	4	3	2	t	f	f	t	2019-12-01 14:03:10.88495+00
292	Timer #292	2019-12-04 21:29:02.720264+00	2019-12-04 21:29:02.771896+00	02:58:06.177689	f	4	3	2	f	t	f	t	2019-12-04 18:30:55.772784+00
229	Timer #229	2019-11-30 00:26:46.746688+00	2019-11-30 00:26:46.771233+00	00:16:01.148675	f	4	3	2	t	f	f	t	2019-11-30 00:10:45.573561+00
264	Timer #264	2019-12-02 13:01:44.46726+00	2019-12-02 13:01:44.485342+00	02:06:20.648791	f	4	3	2	f	t	f	t	2019-12-02 10:55:23.811287+00
270	Timer #270	2019-12-02 18:00:39.986211+00	2019-12-02 18:00:40.021467+00	00:30:17.033895	f	4	3	2	t	f	f	t	2019-12-02 17:30:22.874768+00
288	Timer #288	2019-12-04 13:31:04.148242+00	2019-12-04 13:31:04.173361+00	00:38:32.4923	f	4	3	2	t	f	f	t	2019-12-04 12:52:31.534213+00
239	Timer #239	2019-11-30 15:54:42.180137+00	2019-11-30 15:54:42.235769+00	00:24:36.01273	f	4	3	2	t	f	f	t	2019-11-30 15:30:06.097572+00
237	Timer #237	2019-11-30 14:10:15.200921+00	2019-11-30 14:10:15.234113+00	00:42:00.566775	f	4	3	2	f	t	f	t	2019-11-30 13:28:14.551094+00
316	Timer #316	2019-12-07 10:17:04.621949+00	2019-12-07 10:17:04.657311+00	00:18:01.325326	f	4	3	2	t	f	f	t	2019-12-07 09:59:03.118924+00
226	Timer #226	2019-11-29 18:38:24.271465+00	2019-11-29 18:38:24.298179+00	01:23:48.916165	f	4	3	2	f	t	f	t	2019-11-29 17:14:35.344989+00
223	Timer #223	2019-11-29 14:07:21.496584+00	2019-11-29 14:07:21.532718+00	00:12:45.844069	f	3	3	2	t	f	f	t	2019-11-29 13:54:35.393222+00
246	Timer #246	2019-11-30 23:34:30.914642+00	2019-11-30 23:34:30.932811+00	00:20:43.400042	f	3	3	2	t	f	f	t	2019-11-30 23:13:46.161113+00
278	Timer #278	2019-12-03 06:40:35.718356+00	2019-12-03 06:40:35.745251+00	00:02:58.257333	f	4	3	2	f	f	f	t	2019-12-03 06:37:37.429584+00
233	Timer #233	2019-11-30 09:37:24.225479+00	2019-11-30 09:37:24.266553+00	02:32:45.680342	f	4	3	2	f	t	f	t	2019-11-30 07:04:38.518678+00
256	Timer #256	2019-12-01 20:38:24.459128+00	2019-12-01 20:38:24.478935+00	00:00:07.866274	f	3	3	2	f	f	f	t	2019-12-01 20:38:16.596379+00
312	Timer #312	2019-12-07 01:00:41.478993+00	2019-12-07 01:00:41.50204+00	00:14:26.062709	f	3	3	2	t	f	f	t	2019-12-07 00:46:15.163564+00
219	Timer #219	2019-11-29 09:46:46.380705+00	2019-11-29 09:46:46.406835+00	02:46:18.864828	f	4	3	2	f	t	f	t	2019-11-29 07:00:27.407966+00
243	Timer #243	2019-11-30 21:05:22.85868+00	2019-11-30 21:05:22.878378+00	03:00:11.446996	f	3	3	2	f	t	f	t	2019-11-30 18:05:11.279689+00
250	Timer #250	2019-12-01 07:01:18.532829+00	2019-12-01 07:01:18.555993+00	00:30:07.232677	f	4	3	2	t	f	f	t	2019-12-01 06:31:11.243092+00
231	Timer #231	2019-11-30 06:37:09.480198+00	2019-11-30 06:37:09.534299+00	02:27:21.719817	f	3	3	2	f	t	f	t	2019-11-30 04:09:47.745025+00
276	Timer #276	2019-12-03 06:12:55.904525+00	2019-12-03 06:12:55.926299+00	02:58:10.871814	f	3	3	2	f	t	f	t	2019-12-03 03:14:44.996581+00
258	Timer #258	2019-12-02 02:01:13.610564+00	2019-12-02 02:01:13.634984+00	02:00:54.848642	f	3	3	2	t	f	f	t	2019-12-02 00:00:18.708548+00
224	Timer #224	2019-11-29 15:47:17.752371+00	2019-11-29 15:47:17.77429+00	00:25:38.109511	f	4	3	2	f	f	f	t	2019-11-29 15:21:39.604442+00
266	Timer #266	2019-12-02 14:22:55.16385+00	2019-12-02 14:22:55.180595+00	00:02:25.745623	f	4	3	2	f	f	t	t	2019-12-02 14:20:28.677614+00
235	Timer #235	2019-11-30 10:18:40.726528+00	2019-11-30 10:18:40.777208+00	00:23:55.357563	f	4	3	2	f	t	f	t	2019-11-30 09:54:45.393818+00
227	Timer #227	2019-11-29 19:42:10.349245+00	2019-11-29 19:42:10.374784+00	01:00:36.27313	f	4	3	2	t	f	f	t	2019-11-29 18:41:34.057596+00
248	Timer #248	2019-12-01 03:44:16.360652+00	2019-12-01 03:44:16.377691+00	00:15:08.553976	f	3	3	2	t	f	f	t	2019-12-01 03:29:07.201528+00
298	Timer #298	2019-12-05 07:01:58.977284+00	2019-12-05 07:01:59.000421+00	02:44:50.971707	f	3	3	2	f	t	f	t	2019-12-05 04:17:07.956144+00
252	Timer #252	2019-12-01 10:47:07.014803+00	2019-12-01 10:47:07.070912+00	00:00:00.846951	f	4	3	2	t	f	f	t	2019-12-01 10:47:06.205642+00
274	Timer #274	2019-12-03 01:04:53.38022+00	2019-12-03 01:04:53.402435+00	00:02:19.535722	f	4	3	2	f	f	t	t	2019-12-03 01:02:33.830193+00
262	Timer #262	2019-12-02 10:04:36.287989+00	2019-12-02 10:04:36.30323+00	00:20:13.462996	f	4	3	2	t	f	f	t	2019-12-02 09:44:22.806965+00
296	Timer #296	2019-12-05 01:41:24.423706+00	2019-12-05 01:41:24.450836+00	00:37:30.161084	f	3	3	2	f	f	f	t	2019-12-05 01:03:54.208968+00
272	Timer #272	2019-12-02 21:38:03.527192+00	2019-12-02 21:38:03.576271+00	00:14:57.981803	f	4	3	2	t	f	f	t	2019-12-02 21:23:05.537143+00
300	Timer #300	2019-12-05 10:34:25.865677+00	2019-12-05 10:34:25.898946+00	03:13:29.856169	f	4	3	2	f	t	f	t	2019-12-05 07:20:55.999745+00
282	Timer #282	2019-12-04 01:40:02.840953+00	2019-12-04 01:40:02.866892+00	00:29:34.184364	f	3	3	2	t	f	f	t	2019-12-04 01:10:28.636861+00
290	Timer #290	2019-12-04 17:53:52.983695+00	2019-12-04 17:53:53.007715+00	00:00:21.39538	f	3	3	2	f	f	f	t	2019-12-04 17:53:31.593376+00
302	Timer #302	2019-12-05 20:08:34.209221+00	2019-12-05 20:08:34.236612+00	00:56:27.21948	f	4	3	2	f	t	f	t	2019-12-05 19:12:06.990149+00
294	Timer #294	2019-12-04 22:05:18.858+00	2019-12-04 22:05:18.895509+00	00:05:44.331906	f	4	3	2	f	f	f	t	2019-12-04 21:59:34.386845+00
284	Timer #284	2019-12-04 04:01:36.208439+00	2019-12-04 04:01:36.230314+00	00:15:09.34923	f	3	3	2	f	f	f	t	2019-12-04 03:46:26.829712+00
286	Timer #286	2019-12-04 06:46:47.301352+00	2019-12-04 06:46:47.321035+00	00:33:17.443754	f	4	3	2	t	f	f	t	2019-12-04 06:13:29.785103+00
334	Timer #334	2019-12-10 05:57:58.165463+00	2019-12-10 05:57:58.188124+00	00:12:01.991651	f	3	3	2	f	f	f	t	2019-12-10 05:45:55.195861+00
330	Timer #330	2019-12-09 22:55:08.705781+00	2019-12-09 22:55:08.73044+00	01:12:49.566305	f	4	3	2	t	f	f	t	2019-12-09 21:42:15.352223+00
328	Timer #328	2019-12-09 07:47:34.027906+00	2019-12-09 07:47:34.056425+00	00:15:24.280262	f	4	3	2	t	f	f	t	2019-12-09 07:32:09.713379+00
324	Timer #324	2019-12-08 20:01:31.625705+00	2019-12-08 20:01:31.646027+00	00:24:04.758498	f	3	3	2	t	f	f	t	2019-12-08 19:37:26.762508+00
306	Timer #306	2019-12-06 10:35:28.357604+00	2019-12-06 10:35:28.381654+00	03:57:14.118185	f	3	3	2	f	t	f	t	2019-12-06 06:38:13.697197+00
314	Timer #314	2019-12-07 07:25:58.172305+00	2019-12-07 07:25:58.197093+00	03:07:57.876648	f	3	3	2	f	t	f	t	2019-12-07 04:17:58.072733+00
308	Timer #308	2019-12-06 13:54:51.389438+00	2019-12-06 13:54:51.412329+00	02:55:17.051771	f	4	3	2	f	t	f	t	2019-12-06 10:59:32.83378+00
318	Timer #318	2019-12-08 00:33:43.06453+00	2019-12-08 00:33:43.104388+00	00:42:27.868886	f	3	3	2	t	f	f	t	2019-12-07 23:51:15.099132+00
322	Timer #322	2019-12-08 15:41:19.266233+00	2019-12-08 15:41:19.298152+00	00:29:58.870479	f	3	3	2	f	t	f	t	2019-12-08 15:11:20.247545+00
320	Timer #320	2019-12-08 06:19:49.164115+00	2019-12-08 06:19:49.192549+00	01:55:13.297926	f	3	3	2	f	t	f	t	2019-12-08 04:09:29.024479+00
326	Timer #326	2019-12-09 00:40:37.419028+00	2019-12-09 00:40:37.458114+00	02:46:54.779686	f	3	3	2	t	f	f	t	2019-12-08 21:53:25.874451+00
332	Timer #332	2019-12-10 05:20:49.071962+00	2019-12-10 05:20:49.09464+00	00:46:29.408984	f	3	3	2	f	t	f	t	2019-12-10 04:34:13.25797+00
336	Timer #336	2019-12-10 09:11:57.092123+00	2019-12-10 09:11:57.122363+00	00:15:14.493459	f	4	3	2	t	f	f	t	2019-12-10 08:56:42.397764+00
338	Timer #338	2019-12-10 11:45:14.590919+00	2019-12-10 11:45:14.635001+00	00:16:11.187187	f	4	3	2	t	f	f	t	2019-12-10 11:29:03.170382+00
340	Timer #340	2019-12-10 18:33:53.969182+00	2019-12-10 18:33:53.995021+00	00:14:58.871852	f	4	3	2	t	f	f	t	2019-12-10 18:18:51.976856+00
342	Timer #342	2019-12-11 01:23:47.493205+00	2019-12-11 01:23:47.520667+00	00:43:12.17663	f	4	3	2	t	f	f	t	2019-12-11 00:40:34.434+00
344	Timer #344	2019-12-11 08:34:44.637019+00	2019-12-11 08:34:44.673324+00	04:13:25.267008	f	3	3	2	f	t	f	t	2019-12-11 04:20:54.14905+00
346	Timer #346	2019-12-11 09:44:46.113802+00	2019-12-11 09:44:46.139527+00	00:42:27.932336	f	4	3	2	f	f	f	t	2019-12-11 09:02:17.433793+00
349	Timer #349	2019-12-12 01:28:44.330307+00	2019-12-12 01:28:44.364711+00	00:14:32.332588	f	3	3	2	t	f	f	t	2019-12-12 01:14:11.856666+00
325	Timer #325	2019-12-08 21:16:48.171238+00	2019-12-08 21:16:48.19463+00	00:07:28.51878	f	3	3	2	f	f	f	t	2019-12-08 21:09:19.533371+00
228	Timer #228	2019-11-29 21:55:26.872794+00	2019-11-29 21:55:26.89475+00	00:15:27.827338	f	4	3	2	t	f	f	t	2019-11-29 21:39:58.986955+00
247	Sleep	2019-12-01 03:29:02.289553+00	2019-12-01 03:29:02.305882+00	03:54:04.828336	f	4	3	2	f	t	f	t	2019-11-30 23:34:57.298607+00
238	Timer #238	2019-11-30 15:28:43.00488+00	2019-11-30 15:28:43.035455+00	00:03:52.105969	f	4	3	2	f	f	t	t	2019-11-30 15:24:50.863564+00
281	Timer #281	2019-12-03 20:08:01.185687+00	2019-12-03 20:08:01.208337+00	00:16:37.91986	f	4	3	2	t	f	f	t	2019-12-03 19:51:23.25802+00
273	Timer #273	2019-12-03 00:38:54.444948+00	2019-12-03 00:38:54.466355+00	00:15:32.186335	f	4	3	2	t	f	f	t	2019-12-03 00:23:22.256942+00
287	Timer #287	2019-12-04 09:51:39.452468+00	2019-12-04 09:51:39.476337+00	00:19:09.799434	f	4	3	2	t	f	f	t	2019-12-04 09:32:29.65884+00
240	Timer #240	2019-11-30 15:53:42.489218+00	2019-11-30 15:53:42.520742+00	00:00:00.948023	f	4	3	2	t	f	f	t	2019-11-30 15:53:41.562932+00
277	Timer #277	2019-12-03 06:32:10.171735+00	2019-12-03 06:32:10.192931+00	00:16:29.301974	f	3	3	2	t	f	f	t	2019-12-03 06:15:40.747468+00
261	Timer #261	2019-12-02 09:43:52.000101+00	2019-12-02 09:43:52.018704+00	02:21:31.491329	f	4	3	2	f	t	f	t	2019-12-02 07:22:20.502098+00
234	Timer #234	2019-11-30 09:54:12.911965+00	2019-11-30 09:54:12.968076+00	00:16:40.311806	f	4	3	2	t	f	f	t	2019-11-30 09:37:32.609395+00
230	Timer #230	2019-11-30 03:15:51.921999+00	2019-11-30 03:15:51.956785+00	00:26:38.620147	f	3	3	2	t	f	f	t	2019-11-30 02:49:13.310743+00
265	Timer #265	2019-12-02 13:55:09.422962+00	2019-12-02 13:55:09.438985+00	00:53:15.602666	f	4	3	2	t	f	f	t	2019-12-02 13:01:53.806981+00
299	Timer #299	2019-12-05 07:20:27.863818+00	2019-12-05 07:20:27.88578+00	00:18:23.088913	f	4	3	2	t	f	f	t	2019-12-05 07:02:04.771771+00
311	Timer #311	2019-12-06 22:34:05.023577+00	2019-12-06 22:34:05.045441+00	00:07:34.500904	f	4	3	2	f	f	t	t	2019-12-06 22:26:30.426579+00
257	Feeding	2019-12-01 22:00:56.805798+00	2019-12-01 22:00:56.827272+00	01:13:27.775745	f	3	3	2	t	f	f	t	2019-12-01 20:47:28.873896+00
255	Timer #255	2019-12-01 17:05:34.622479+00	2019-12-01 17:05:34.64189+00	00:17:55.915994	f	3	3	2	t	f	f	t	2019-12-01 16:47:38.669302+00
242	Timer #242	2019-11-30 18:04:51.229205+00	2019-11-30 18:04:51.27134+00	00:14:35.961327	f	3	3	2	t	f	f	t	2019-11-30 17:50:15.288695+00
236	Timer #236	2019-11-30 13:27:44.860157+00	2019-11-30 13:27:44.898735+00	01:04:53.527652	f	4	3	2	t	f	f	t	2019-11-30 12:22:51.337042+00
313	Timer #313	2019-12-07 03:42:35.911434+00	2019-12-07 03:42:35.937073+00	00:23:58.526737	f	3	3	2	t	f	f	t	2019-12-07 03:18:37.21338+00
309	Timer #309	2019-12-06 14:28:43.670206+00	2019-12-06 14:28:43.692335+00	00:33:35.083804	f	4	3	2	t	f	f	t	2019-12-06 13:55:08.102904+00
249	Timer #249	2019-12-01 05:59:26.43909+00	2019-12-01 05:59:26.452893+00	01:46:55.445019	f	3	3	2	f	t	f	t	2019-12-01 04:12:30.969341+00
291	Timer #291	2019-12-04 18:13:31.408954+00	2019-12-04 18:13:31.432585+00	00:06:45.139484	f	4	3	2	t	f	f	t	2019-12-04 18:06:46.25325+00
297	Timer #297	2019-12-05 04:16:58.610416+00	2019-12-05 04:16:58.64043+00	00:41:01.663158	f	3	3	2	f	f	f	t	2019-12-05 03:35:56.94189+00
275	Timer #275	2019-12-03 01:31:14.605799+00	2019-12-03 01:31:14.623474+00	00:09:25.371297	f	4	3	2	t	f	f	t	2019-12-03 01:21:49.225712+00
263	Timer #263	2019-12-02 10:54:38.01306+00	2019-12-02 10:54:38.030167+00	00:48:38.103623	f	4	3	2	f	t	f	t	2019-12-02 10:05:59.904837+00
289	Timer #289	2019-12-04 16:19:48.945381+00	2019-12-04 16:19:48.976564+00	00:37:53.979206	f	4	3	2	t	f	f	t	2019-12-04 15:41:54.209094+00
267	Timer #267	2019-12-02 15:18:14.300288+00	2019-12-02 15:18:14.317629+00	00:06:05.524346	f	4	3	2	f	t	f	t	2019-12-02 15:12:08.763014+00
253	Timer #253	2019-12-01 13:04:32.084509+00	2019-12-01 13:04:32.184774+00	00:14:48.667136	f	4	3	2	t	f	f	t	2019-12-01 12:49:43.34326+00
271	Timer #271	2019-12-02 21:22:58.638877+00	2019-12-02 21:22:58.668461+00	03:22:01.20593	f	3	3	2	f	t	f	t	2019-12-02 18:00:57.185947+00
232	Timer #232	2019-11-30 07:04:16.342114+00	2019-11-30 07:04:16.371819+00	00:27:26.382374	f	4	3	2	t	f	f	t	2019-11-30 06:36:49.895513+00
259	Timer #259	2019-12-02 03:09:55.523125+00	2019-12-02 03:09:55.542409+00	00:16:42.512556	f	4	3	2	t	f	f	t	2019-12-02 02:53:12.996625+00
244	Timer #244	2019-11-30 21:46:49.323926+00	2019-11-30 21:46:49.3443+00	00:32:00.698963	f	3	3	2	t	f	f	t	2019-11-30 21:14:48.577167+00
279	Timer #279	2019-12-03 10:02:52.050748+00	2019-12-03 10:02:52.072501+00	00:17:43.399984	f	4	3	2	t	f	f	t	2019-12-03 09:45:08.551442+00
251	Timer #251	2019-12-01 10:23:40.261479+00	2019-12-01 10:23:40.286513+00	02:08:48.649455	f	4	3	2	f	t	f	t	2019-12-01 08:14:51.600239+00
303	Timer #303	2019-12-05 20:40:39.682039+00	2019-12-05 20:40:39.707284+00	00:24:40.387383	f	4	3	2	t	f	f	t	2019-12-05 20:15:58.62129+00
301	Timer #301	2019-12-05 10:56:14.962412+00	2019-12-05 10:56:14.986937+00	00:21:36.225669	f	4	3	2	t	f	f	t	2019-12-05 10:34:38.673164+00
305	Timer #305	2019-12-06 05:49:49.384789+00	2019-12-06 05:49:49.405872+00	01:05:12.127744	f	3	3	2	f	t	f	t	2019-12-06 04:44:36.619434+00
283	Timer #283	2019-12-04 03:36:07.395307+00	2019-12-04 03:36:07.417544+00	00:27:37.18146	f	4	3	2	t	f	f	t	2019-12-04 03:08:30.189683+00
293	Timer #293	2019-12-04 22:00:01.187044+00	2019-12-04 22:00:01.228009+00	00:26:01.6517	f	4	3	2	t	f	f	t	2019-12-04 21:33:59.423913+00
285	Timer #285	2019-12-04 06:09:31.964027+00	2019-12-04 06:09:31.986751+00	02:07:21.406889	f	3	3	2	f	t	f	t	2019-12-04 04:02:09.927342+00
269	Timer #269	2019-12-02 17:18:32.785877+00	2019-12-02 17:18:32.834688+00	00:02:14.653692	f	4	3	2	f	f	t	t	2019-12-02 17:16:18.009706+00
295	Timer #295	2019-12-05 00:13:17.721294+00	2019-12-05 00:13:17.754562+00	00:06:14.712615	f	3	3	2	t	f	f	t	2019-12-05 00:07:02.286332+00
307	Timer #307	2019-12-06 10:58:58.363927+00	2019-12-06 10:58:58.385123+00	00:22:02.773859	f	4	3	2	t	f	f	t	2019-12-06 10:36:54.985239+00
341	Timer #341	2019-12-10 22:02:59.052287+00	2019-12-10 22:02:59.075347+00	00:25:50.636788	f	4	3	2	t	f	f	t	2019-12-10 21:37:01.063447+00
343	Timer #343	2019-12-11 04:17:05.036034+00	2019-12-11 04:17:05.059385+00	01:08:39.152212	f	4	3	2	t	f	f	t	2019-12-11 03:08:25.744104+00
321	Timer #321	2019-12-08 06:50:56.870907+00	2019-12-08 06:50:56.893894+00	00:28:15.10199	f	4	3	2	t	f	f	t	2019-12-08 06:22:41.019499+00
329	Timer #329	2019-12-09 17:43:51.610566+00	2019-12-09 17:43:51.641606+00	00:19:06.901151	f	4	3	2	t	f	f	t	2019-12-09 17:24:41.860597+00
319	Timer #319	2019-12-08 03:39:09.461221+00	2019-12-08 03:39:09.491458+00	00:26:53.576893	f	3	3	2	t	f	f	t	2019-12-08 03:12:14.428408+00
317	Timer #317	2019-12-07 12:55:37.456247+00	2019-12-07 12:55:37.478616+00	00:22:34.749706	f	4	3	2	t	f	f	t	2019-12-07 12:33:01.936925+00
315	Timer #315	2019-12-07 07:45:11.5163+00	2019-12-07 07:45:11.542658+00	00:18:55.858042	f	4	3	2	t	f	f	t	2019-12-07 07:26:15.577106+00
333	Timer #333	2019-12-10 05:41:01.648997+00	2019-12-10 05:41:01.68181+00	00:15:32.596374	f	3	3	2	t	f	f	t	2019-12-10 05:25:28.419477+00
327	Timer #327	2019-12-09 03:52:02.033172+00	2019-12-09 03:52:02.090915+00	00:25:38.001382	f	3	3	2	t	f	f	t	2019-12-09 03:26:19.415541+00
323	Timer #323	2019-12-08 16:20:19.258473+00	2019-12-08 16:20:19.293487+00	00:38:41.680498	f	4	3	2	t	f	f	t	2019-12-08 15:41:37.541449+00
339	Timer #339	2019-12-10 14:24:55.604006+00	2019-12-10 14:24:55.636229+00	00:17:52.279126	f	4	3	2	t	f	f	t	2019-12-10 14:07:00.516386+00
335	Timer #335	2019-12-10 08:56:25.598569+00	2019-12-10 08:56:25.627998+00	02:04:07.744717	f	3	3	2	f	t	f	t	2019-12-10 06:52:17.560861+00
331	Timer #331	2019-12-10 03:24:04.859945+00	2019-12-10 03:24:04.886682+00	00:52:25.388119	f	3	3	2	t	f	f	t	2019-12-10 02:31:39.174837+00
337	Timer #337	2019-12-10 11:25:40.678332+00	2019-12-10 11:25:40.703734+00	02:13:10.313916	f	4	3	2	f	f	f	t	2019-12-10 09:12:29.468195+00
350	Timer #350	2019-12-12 04:06:01.931575+00	2019-12-12 04:06:01.956517+00	00:59:54.570536	f	3	3	2	f	t	f	t	2019-12-12 03:06:03.255492+00
348	Timer #348	2019-12-11 23:42:07.833859+00	2019-12-11 23:42:07.856324+00	00:02:59.24335	f	4	3	2	f	f	t	t	2019-12-11 23:39:07.470291+00
347	Timer #347	2019-12-11 11:24:02.947937+00	2019-12-11 11:24:02.984247+00	00:06:04.154561	f	4	3	2	t	f	f	t	2019-12-11 11:17:58.052822+00
345	Timer #345	2019-12-11 09:01:50.345454+00	2019-12-11 09:01:50.368987+00	00:26:47.283862	f	4	3	2	t	f	f	t	2019-12-11 08:35:03.022621+00
351	Timer #351	2019-12-12 04:28:13.173203+00	2019-12-12 04:28:13.196599+00	00:18:16.376541	f	3	3	2	t	f	f	t	2019-12-12 04:09:55.793873+00
\.


--
-- Data for Name: core_tummytime; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_tummytime (id, start, "end", duration, milestone, child_id) FROM stdin;
1	2019-11-08 19:07:02.269781+00	2019-11-08 19:08:04.405189+00	00:01:02.135408		2
2	2019-11-18 15:40:55.741732+00	2019-11-18 15:42:58.755593+00	00:02:03.013861		2
3	2019-11-20 00:26:21.822491+00	2019-11-20 00:27:31.697748+00	00:01:09.875257		2
4	2019-11-20 21:16:52.984819+00	2019-11-20 21:17:57.650876+00	00:01:04.666057		2
5	2019-11-23 00:41:30.708859+00	2019-11-23 00:43:43.712103+00	00:02:13.003244		2
6	2019-11-26 00:32:14.041806+00	2019-11-26 00:34:03.880639+00	00:01:49.838833		2
7	2019-11-26 21:31:53.093966+00	2019-11-26 21:33:55.296782+00	00:02:02.202816		2
8	2019-11-29 01:18:34.619831+00	2019-11-29 01:20:17.686617+00	00:01:43.066786		2
9	2019-11-30 15:24:50.929486+00	2019-11-30 15:28:43.035455+00	00:03:52.105969		2
10	2019-12-02 14:20:29.434972+00	2019-12-02 14:22:55.180595+00	00:02:25.745623		2
11	2019-12-02 17:16:18.180996+00	2019-12-02 17:18:32.834688+00	00:02:14.653692		2
12	2019-12-03 01:02:33.866713+00	2019-12-03 01:04:53.402435+00	00:02:19.535722		2
13	2019-12-06 22:26:30.544537+00	2019-12-06 22:34:05.045441+00	00:07:34.500904		2
14	2019-12-08 00:32:00+00	2019-12-08 00:33:00+00	00:01:00		2
15	2019-12-11 23:39:08.612974+00	2019-12-11 23:42:07.856324+00	00:02:59.24335		2
\.


--
-- Data for Name: core_weight; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.core_weight (id, weight, date, child_id, units) FROM stdin;
1	7.3125	2019-11-04	2	pounds
2	7.5	2019-11-09	2	pounds
3	8.47000000000000064	2019-11-19	2	pounds
4	10.375	2019-12-05	2	pounds
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
1	2019-11-03 23:14:09.76991+00	1	admin	2	[{"changed": {"fields": ["password"]}}]	23	1
2	2019-11-03 23:14:28.892616+00	1	baadmin	2	[{"changed": {"fields": ["username"]}}]	23	1
3	2019-11-08 01:20:46.646605+00	11	Timer #11	2	[{"changed": {"fields": ["start", "active", "complete"]}}]	9	1
4	2019-11-09 23:32:53.22305+00	31	Feeding	3		6	1
5	2019-11-11 23:34:07.961269+00	50	Timer #50	3		9	1
6	2019-11-11 23:41:00.273003+00	11	Sleep	3		8	1
7	2019-11-13 05:50:21.591961+00	63	Timer #63	1	[{"added": {}}]	9	1
8	2019-11-13 05:51:29.626096+00	63	Timer #63	2	[{"changed": {"fields": ["account"]}}]	9	1
9	2019-11-13 05:52:36.599041+00	63	Timer #63	2	[{"changed": {"fields": ["active"]}}]	9	1
10	2019-11-13 05:54:28.408236+00	63	Timer #63	3		9	1
11	2019-11-30 21:03:39.704413+00	1	easierparenting12 (12 month)	1	[{"added": {}}]	26	1
12	2019-12-06 18:23:36.698216+00	2	betaparents6 (6 month)	1	[{"added": {}}]	26	1
13	2019-12-06 18:42:49.671565+00	2	amcquistan	2	[{"changed": {"fields": ["email"]}}]	23	1
14	2019-12-06 19:01:12.967108+00	3	mcquistan	2	[{"changed": {"fields": ["email"]}}]	23	1
15	2019-12-06 19:47:16.5763+00	2	betaparents6 (6 month)	2	[{"changed": {"fields": ["max_usage"]}}]	26	1
16	2019-12-07 14:36:48.891416+00	7	adam.mcquistan@thecodinginterface.com	2	[{"changed": {"fields": ["email"]}}]	23	1
17	2019-12-07 14:37:18.910282+00	3	mcquistan	2	[{"changed": {"fields": ["email"]}}]	23	1
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	babybuddy	settings
2	babybuddy	account
3	babybuddy	accountmembersettings
4	core	child
5	core	diaperchange
6	core	feeding
7	core	note
8	core	sleep
9	core	timer
10	core	tummytime
11	core	weight
12	core	temperature
13	core	notification
14	core	notificationevent
15	core	suggestion
16	authtoken	token
17	easy_thumbnails	source
18	easy_thumbnails	thumbnail
19	easy_thumbnails	thumbnaildimensions
20	admin	logentry
21	auth	permission
22	auth	group
23	auth	user
24	contenttypes	contenttype
25	sessions	session
26	babybuddy	promocode
27	babybuddy	accountpromocode
28	core	bath
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2019-11-03 03:22:32.755704+00
2	auth	0001_initial	2019-11-03 03:22:32.818831+00
3	admin	0001_initial	2019-11-03 03:22:33.816105+00
4	admin	0002_logentry_remove_auto_add	2019-11-03 03:22:33.842011+00
5	admin	0003_logentry_add_action_flag_choices	2019-11-03 03:22:33.856102+00
6	contenttypes	0002_remove_content_type_name	2019-11-03 03:22:33.882994+00
7	auth	0002_alter_permission_name_max_length	2019-11-03 03:22:33.892167+00
8	auth	0003_alter_user_email_max_length	2019-11-03 03:22:33.904751+00
9	auth	0004_alter_user_username_opts	2019-11-03 03:22:33.917545+00
10	auth	0005_alter_user_last_login_null	2019-11-03 03:22:33.930129+00
11	auth	0006_require_contenttypes_0002	2019-11-03 03:22:33.933536+00
12	auth	0007_alter_validators_add_error_messages	2019-11-03 03:22:33.947046+00
13	auth	0008_alter_user_username_max_length	2019-11-03 03:22:33.968486+00
14	auth	0009_alter_user_last_name_max_length	2019-11-03 03:22:33.986346+00
15	auth	0010_alter_group_name_max_length	2019-11-03 03:22:34.001837+00
16	auth	0011_update_proxy_permissions	2019-11-03 03:22:34.016472+00
17	authtoken	0001_initial	2019-11-03 03:22:34.03775+00
18	authtoken	0002_auto_20160226_1747	2019-11-03 03:22:34.094593+00
19	babybuddy	0001_initial	2019-11-03 03:22:34.122913+00
20	babybuddy	0002_add_settings	2019-11-03 03:22:34.141931+00
21	babybuddy	0003_add_refresh_help_text	2019-11-03 03:22:34.15572+00
22	babybuddy	0004_settings_language	2019-11-03 03:22:34.179433+00
23	babybuddy	0005_auto_20190502_1701	2019-11-03 03:22:34.192914+00
24	babybuddy	0006_auto_20190502_1744	2019-11-03 03:22:34.205502+00
25	babybuddy	0007_auto_20190607_1422	2019-11-03 03:22:34.218057+00
26	babybuddy	0008_account	2019-11-03 03:22:34.248777+00
27	babybuddy	0009_auto_20191017_0416	2019-11-03 03:22:34.397641+00
28	babybuddy	0010_auto_20191017_2226	2019-11-03 03:22:34.454462+00
29	babybuddy	0011_auto_20191018_0241	2019-11-03 03:22:34.501634+00
30	babybuddy	0012_auto_20191020_1857	2019-11-03 03:22:34.550766+00
31	babybuddy	0013_auto_20191020_2341	2019-11-03 03:22:34.606807+00
32	babybuddy	0014_auto_20191022_0409	2019-11-03 03:22:34.69668+00
33	babybuddy	0015_accountmembersettings_is_active	2019-11-03 03:22:34.722689+00
34	core	0001_initial	2019-11-03 03:22:34.826513+00
35	core	0002_auto_20171028_1257	2019-11-03 03:22:34.881784+00
36	core	0003_weight	2019-11-03 03:22:34.900867+00
37	core	0004_child_picture	2019-11-03 03:22:34.922702+00
38	core	0005_auto_20190416_2048	2019-11-03 03:22:35.423565+00
39	core	0006_auto_20190502_1701	2019-11-03 03:22:35.436625+00
40	core	0007_temperature	2019-11-03 03:22:35.45588+00
41	core	0008_auto_20190607_1422	2019-11-03 03:22:35.475541+00
42	core	0009_child_account	2019-11-03 03:22:35.503554+00
43	core	0010_auto_20191017_0416	2019-11-03 03:22:35.544652+00
44	core	0011_auto_20191017_0500	2019-11-03 03:22:35.578801+00
45	core	0012_auto_20191022_0409	2019-11-03 03:22:35.612817+00
46	core	0013_auto_20191022_1233	2019-11-03 03:22:35.742068+00
47	core	0014_timer_complete	2019-11-03 03:22:35.791302+00
48	core	0015_auto_20191023_1229	2019-11-03 03:22:35.868046+00
49	core	0016_auto_20191023_2216	2019-11-03 03:22:36.110495+00
50	core	0017_notification_child	2019-11-03 03:22:36.164307+00
51	core	0018_auto_20191025_0222	2019-11-03 03:22:36.688866+00
52	core	0019_child_is_active	2019-11-03 03:22:36.733741+00
53	core	0020_auto_20191028_1247	2019-11-03 03:22:36.759722+00
54	core	0021_timer_created	2019-11-03 03:22:36.794232+00
55	core	0022_auto_20191029_0000	2019-11-03 03:22:36.816518+00
56	core	0023_auto_20191029_0836	2019-11-03 03:22:36.845556+00
57	core	0024_auto_20191031_0801	2019-11-03 03:22:37.136932+00
58	core	0025_auto_20191031_0810	2019-11-03 03:22:37.177922+00
59	core	0026_auto_20191031_0905	2019-11-03 03:22:37.303244+00
60	core	0027_auto_20191102_0741	2019-11-03 03:22:37.380903+00
61	easy_thumbnails	0001_initial	2019-11-03 03:22:37.422324+00
62	easy_thumbnails	0002_thumbnaildimensions	2019-11-03 03:22:37.477926+00
63	sessions	0001_initial	2019-11-03 03:22:37.496473+00
64	babybuddy	0016_auto_20191127_1424	2019-11-30 20:31:21.438864+00
65	babybuddy	0017_promocode_max_usage_per_account	2019-11-30 20:31:21.473861+00
66	babybuddy	0018_promocode_stripe	2019-11-30 20:31:21.490891+00
67	babybuddy	0019_promocode_promo_price	2019-11-30 20:31:21.508609+00
68	core	0028_auto_20191130_2017	2019-12-04 12:46:01.474664+00
69	core	0029_auto_20191202_2234	2019-12-04 12:46:01.561221+00
70	core	0030_auto_20191202_2255	2019-12-04 12:46:01.588183+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
ff2uigtnwgabou5cmh2xkytrxhpz08pj	NTA4ZWYzZTk0MjkxM2ZlYWRiNmI5OTFjZTE5MzFkMWRlOWM0MTJmZjp7Il9hdXRoX3VzZXJfaWQiOiIzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJlMDUyOTI1ZmNhOWFiMzQ2OTQzNjFjODY1NTIwNTcwNjA2ZTEyYjhmIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-11 18:22:16.617703+00
aowc1fvflu7pfzsjhrg5ga5f6krj0gas	NTA4ZWYzZTk0MjkxM2ZlYWRiNmI5OTFjZTE5MzFkMWRlOWM0MTJmZjp7Il9hdXRoX3VzZXJfaWQiOiIzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJlMDUyOTI1ZmNhOWFiMzQ2OTQzNjFjODY1NTIwNTcwNjA2ZTEyYjhmIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-12 01:09:07.812889+00
3l4o0enaqk79tekoi60g1yuc9d8pzib0	NTA4ZWYzZTk0MjkxM2ZlYWRiNmI5OTFjZTE5MzFkMWRlOWM0MTJmZjp7Il9hdXRoX3VzZXJfaWQiOiIzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJlMDUyOTI1ZmNhOWFiMzQ2OTQzNjFjODY1NTIwNTcwNjA2ZTEyYjhmIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-15 20:34:22.743178+00
eh95rpoo6l4qzxxxov7jru9xkyhbup8m	NTU0MTE4OGViNjQzZGI2NmQzZDJjN2Y3MWZkYjFlOTgxOTllZTYyNDp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImUwNTI5MjVmY2E5YWIzNDY5NDM2MWM4NjU1MjA1NzA2MDZlMTJiOGYifQ==	2019-11-18 18:45:22.516977+00
7pnu9ql1zdv1158yzm0gv46j1bwonvr2	NTU0MTE4OGViNjQzZGI2NmQzZDJjN2Y3MWZkYjFlOTgxOTllZTYyNDp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImUwNTI5MjVmY2E5YWIzNDY5NDM2MWM4NjU1MjA1NzA2MDZlMTJiOGYifQ==	2019-11-20 21:55:36.953605+00
hk5sowyn0kp0sqe17bwbx5q0jk8np4lb	YTkxYjIzYTAzYjFmYWRjMGEwMjVmMDVkN2QyYWVkM2VjM2YxMGE0MTp7Il9hdXRoX3VzZXJfaWQiOiI0IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIzMDk3ZTdlZDk3ZmVlZDY0YmIxOGQ2YjM5ZmJiYmMxMWI0ZTcwMzNjIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-11-21 21:00:56.758708+00
qmc23q4582ns0qsa2d1e1itaijzgdlrd	YTkxYjIzYTAzYjFmYWRjMGEwMjVmMDVkN2QyYWVkM2VjM2YxMGE0MTp7Il9hdXRoX3VzZXJfaWQiOiI0IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIzMDk3ZTdlZDk3ZmVlZDY0YmIxOGQ2YjM5ZmJiYmMxMWI0ZTcwMzNjIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-11-21 23:14:35.024212+00
bmii7bbq1xoqjy7tk4wrnnd8n5fw94xa	NmI0NTlmMDM1MjVkZDgyZmZiY2E3N2YyZTBlYmNhM2M1ZmE2OGI3Nzp7Il9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI1MDE5YmUyMGVmYWIxNDk4OTRjOTUxNzU2NmYwNjhmNDBkODQ5M2U1IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-11-22 00:53:13.442003+00
uj2sc9kmz78k7qvfm0b2a7zxxdna9ojv	NjM5MjVjZTE4NGNjMzU2ZTZlMzA1ZWRlYWEyZjZiMTY1ZWIzZTY1Zjp7Il9hdXRoX3VzZXJfaWQiOiI1IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxNTE4ODAzNmI5YjNjZTg0NDVmMjI2NDM1YWI5MTYxNzc2NTkxMGUyIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-11-22 16:06:38.758526+00
qmbvk7q4hvupxt4yjfcd7rrb67yz8pwi	NTU0MTE4OGViNjQzZGI2NmQzZDJjN2Y3MWZkYjFlOTgxOTllZTYyNDp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImUwNTI5MjVmY2E5YWIzNDY5NDM2MWM4NjU1MjA1NzA2MDZlMTJiOGYifQ==	2019-11-25 16:05:25.82984+00
7o1wzhyaekqwrjyv9gqy5h94n87dht8s	NTA4ZWYzZTk0MjkxM2ZlYWRiNmI5OTFjZTE5MzFkMWRlOWM0MTJmZjp7Il9hdXRoX3VzZXJfaWQiOiIzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJlMDUyOTI1ZmNhOWFiMzQ2OTQzNjFjODY1NTIwNTcwNjA2ZTEyYjhmIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-02 20:24:10.279262+00
5fzad7dh0iuh8ca6l0h67oyv28xkr7kb	YTNkZGRlMWIyNTQ1MmM0MDY1ZmNhMzE4MmQwMDZjM2EyZjM3YjAwNjp7Il9hdXRoX3VzZXJfaWQiOiI1IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxZTA2NDI4NzdlZDIyODM0MDRjMDhkNTE4N2JhOGQwNTEwZjJiZWQ2IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-03 16:21:05.303042+00
vmjrpl1t9ilxc4w7qpyjnx8qqugs9f8f	YTNkZGRlMWIyNTQ1MmM0MDY1ZmNhMzE4MmQwMDZjM2EyZjM3YjAwNjp7Il9hdXRoX3VzZXJfaWQiOiI1IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxZTA2NDI4NzdlZDIyODM0MDRjMDhkNTE4N2JhOGQwNTEwZjJiZWQ2IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-05 06:20:58.089547+00
6dyjel620fajrasb3espm4u0v005fipy	YTNkZGRlMWIyNTQ1MmM0MDY1ZmNhMzE4MmQwMDZjM2EyZjM3YjAwNjp7Il9hdXRoX3VzZXJfaWQiOiI1IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxZTA2NDI4NzdlZDIyODM0MDRjMDhkNTE4N2JhOGQwNTEwZjJiZWQ2IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-05 18:28:37.983371+00
9y0tfongt136g2hj34uaj1yhv8l23u7u	YTNkZGRlMWIyNTQ1MmM0MDY1ZmNhMzE4MmQwMDZjM2EyZjM3YjAwNjp7Il9hdXRoX3VzZXJfaWQiOiI1IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxZTA2NDI4NzdlZDIyODM0MDRjMDhkNTE4N2JhOGQwNTEwZjJiZWQ2IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-05 18:28:38.686417+00
w4yy9bkfcuqg1bj38cskdznpt4uslp1o	YTNkZGRlMWIyNTQ1MmM0MDY1ZmNhMzE4MmQwMDZjM2EyZjM3YjAwNjp7Il9hdXRoX3VzZXJfaWQiOiI1IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxZTA2NDI4NzdlZDIyODM0MDRjMDhkNTE4N2JhOGQwNTEwZjJiZWQ2IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-05 19:39:34.097769+00
oes76gla3okzos0b465n19k78rnx2p4y	NTA4ZWYzZTk0MjkxM2ZlYWRiNmI5OTFjZTE5MzFkMWRlOWM0MTJmZjp7Il9hdXRoX3VzZXJfaWQiOiIzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJlMDUyOTI1ZmNhOWFiMzQ2OTQzNjFjODY1NTIwNTcwNjA2ZTEyYjhmIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-07 14:50:23.678204+00
gycx8jl36e3yy8hqp54zriilzmntd2rx	YTkxYjIzYTAzYjFmYWRjMGEwMjVmMDVkN2QyYWVkM2VjM2YxMGE0MTp7Il9hdXRoX3VzZXJfaWQiOiI0IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIzMDk3ZTdlZDk3ZmVlZDY0YmIxOGQ2YjM5ZmJiYmMxMWI0ZTcwMzNjIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-07 19:42:52.333092+00
lu7kucqd69da81xb3nndcqnn4su1qbwg	NWU2NDA0M2MzYzFlZmU2NzZiYWUwNDllYjAxYjdjMjE4Nzk1ZDQzNTp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjQiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjMwOTdlN2VkOTdmZWVkNjRiYjE4ZDZiMzlmYmJiYzExYjRlNzAzM2MifQ==	2019-12-07 19:44:51.984619+00
bz2a65dff1ahtze1oxtynmzblsrfs5wq	YTkxYjIzYTAzYjFmYWRjMGEwMjVmMDVkN2QyYWVkM2VjM2YxMGE0MTp7Il9hdXRoX3VzZXJfaWQiOiI0IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIzMDk3ZTdlZDk3ZmVlZDY0YmIxOGQ2YjM5ZmJiYmMxMWI0ZTcwMzNjIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-07 19:58:19.942536+00
vbujmhnegyo5rlqu2qvb7wykwy5eycud	YTNkZGRlMWIyNTQ1MmM0MDY1ZmNhMzE4MmQwMDZjM2EyZjM3YjAwNjp7Il9hdXRoX3VzZXJfaWQiOiI1IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxZTA2NDI4NzdlZDIyODM0MDRjMDhkNTE4N2JhOGQwNTEwZjJiZWQ2IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-11 16:51:16.760214+00
smf4ughodyo5f6arua4c80baau53emek	ZmYzMjRhM2ZhYWQ4MjBhMDQzNzIzNTg2NzM3ZjA5ZGQ4N2Q5ZDhmMTp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjEiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjUwMTliZTIwZWZhYjE0OTg5NGM5NTE3NTY2ZjA2OGY0MGQ4NDkzZTUifQ==	2019-12-14 21:01:36.893178+00
mswn2ygm6qb62jhpoh6na941qtn8kmhj	NmI0NTlmMDM1MjVkZDgyZmZiY2E3N2YyZTBlYmNhM2M1ZmE2OGI3Nzp7Il9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI1MDE5YmUyMGVmYWIxNDk4OTRjOTUxNzU2NmYwNjhmNDBkODQ5M2U1IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-20 18:42:20.837254+00
t0kg9buh2k8wd2p2pvtbadugbei11tp1	ZjNlZGE5NTc0NGQwZmI5ZTE0MzhmYjVlMDRhZjlmZWUzYmE4N2UyMTp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjYiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjBhYjI5OWJmMWMwYjMzODdhZjA2ODFmMzgyNTAyYWU3ZTY0NmQ3NzQifQ==	2019-12-20 19:04:39.43393+00
k1zixa177jqvz31g04hytifwzsxjwxce	MmNiMzhlMGU3YzU0ODM1ZTNmMmY2YzcwOThkNjJmODUxOThjODVkNzp7Il9hdXRoX3VzZXJfaWQiOiI3IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJmZmM4MmNkNzc2NjMzODcxN2ZjODRiM2M4NTY0YjkyZjllYTkyNGFiIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-20 19:08:42.918271+00
x74zpgszz6rordvrly5idn62d8jj5yew	NTU0MTE4OGViNjQzZGI2NmQzZDJjN2Y3MWZkYjFlOTgxOTllZTYyNDp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImUwNTI5MjVmY2E5YWIzNDY5NDM2MWM4NjU1MjA1NzA2MDZlMTJiOGYifQ==	2019-12-20 22:47:08.151218+00
i0bbbljgmuauymch39wt7ayiul3fbpk1	NTA4ZWYzZTk0MjkxM2ZlYWRiNmI5OTFjZTE5MzFkMWRlOWM0MTJmZjp7Il9hdXRoX3VzZXJfaWQiOiIzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJlMDUyOTI1ZmNhOWFiMzQ2OTQzNjFjODY1NTIwNTcwNjA2ZTEyYjhmIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-21 14:09:06.506186+00
nbamujnjon4i0bhmly04nqzaa14cr65i	YTkxYjIzYTAzYjFmYWRjMGEwMjVmMDVkN2QyYWVkM2VjM2YxMGE0MTp7Il9hdXRoX3VzZXJfaWQiOiI0IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIzMDk3ZTdlZDk3ZmVlZDY0YmIxOGQ2YjM5ZmJiYmMxMWI0ZTcwMzNjIiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-22 06:17:52.523042+00
8jsaaqxpxmlc8rnmy8rrtwbvzidqkh70	NTU0MTE4OGViNjQzZGI2NmQzZDJjN2Y3MWZkYjFlOTgxOTllZTYyNDp7Il9sYW5ndWFnZSI6ImVuIiwiX2F1dGhfdXNlcl9pZCI6IjMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImUwNTI5MjVmY2E5YWIzNDY5NDM2MWM4NjU1MjA1NzA2MDZlMTJiOGYifQ==	2019-12-23 06:10:14.051787+00
1wnfcmqmrahr3ksowkon33b5i4x396rx	MWRiMDhjODVlZGM4YTljMzM5MWJmZjIwOTMyZTQxNWI3MDk3YjM4ODp7Il9hdXRoX3VzZXJfaWQiOiI4IiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI2YTRlMDQwZDAzNGUyNWZjMTYwMzIwYTBmYjg0NTM3MGE3MDZkYzc4IiwiX2xhbmd1YWdlIjoiZW4ifQ==	2019-12-23 13:40:00.091916+00
\.


--
-- Data for Name: easy_thumbnails_source; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.easy_thumbnails_source (id, storage_hash, name, modified) FROM stdin;
\.


--
-- Data for Name: easy_thumbnails_thumbnail; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.easy_thumbnails_thumbnail (id, storage_hash, name, modified, source_id) FROM stdin;
\.


--
-- Data for Name: easy_thumbnails_thumbnaildimensions; Type: TABLE DATA; Schema: public; Owner: babyasst
--

COPY public.easy_thumbnails_thumbnaildimensions (id, thumbnail_id, width, height) FROM stdin;
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 112, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 8, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: babybuddy_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.babybuddy_account_id_seq', 8, true);


--
-- Name: babybuddy_account_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.babybuddy_account_users_id_seq', 11, true);


--
-- Name: babybuddy_accountmembersettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.babybuddy_accountmembersettings_id_seq', 12, true);


--
-- Name: babybuddy_accountpromocode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.babybuddy_accountpromocode_id_seq', 2, true);


--
-- Name: babybuddy_promocode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.babybuddy_promocode_id_seq', 2, true);


--
-- Name: babybuddy_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.babybuddy_settings_id_seq', 8, true);


--
-- Name: core_bath_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_bath_id_seq', 3, true);


--
-- Name: core_child_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_child_id_seq', 4, true);


--
-- Name: core_diaperchange_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_diaperchange_id_seq', 274, true);


--
-- Name: core_feeding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_feeding_id_seq', 330, true);


--
-- Name: core_note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_note_id_seq', 2, true);


--
-- Name: core_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_notification_id_seq', 1, true);


--
-- Name: core_notificationevent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_notificationevent_id_seq', 3, true);


--
-- Name: core_sleep_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_sleep_id_seq', 127, true);


--
-- Name: core_suggestion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_suggestion_id_seq', 1, false);


--
-- Name: core_temperature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_temperature_id_seq', 2, true);


--
-- Name: core_timer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_timer_id_seq', 351, true);


--
-- Name: core_tummytime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_tummytime_id_seq', 15, true);


--
-- Name: core_weight_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.core_weight_id_seq', 4, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 17, true);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 28, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 70, true);


--
-- Name: easy_thumbnails_source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.easy_thumbnails_source_id_seq', 1, false);


--
-- Name: easy_thumbnails_thumbnail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.easy_thumbnails_thumbnail_id_seq', 1, false);


--
-- Name: easy_thumbnails_thumbnaildimensions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: babyasst
--

SELECT pg_catalog.setval('public.easy_thumbnails_thumbnaildimensions_id_seq', 1, false);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- Name: babybuddy_account babybuddy_account_owner_id_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account
    ADD CONSTRAINT babybuddy_account_owner_id_key UNIQUE (owner_id);


--
-- Name: babybuddy_account babybuddy_account_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account
    ADD CONSTRAINT babybuddy_account_pkey PRIMARY KEY (id);


--
-- Name: babybuddy_account babybuddy_account_slug_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account
    ADD CONSTRAINT babybuddy_account_slug_key UNIQUE (slug);


--
-- Name: babybuddy_account_users babybuddy_account_users_account_id_user_id_b3c30c96_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account_users
    ADD CONSTRAINT babybuddy_account_users_account_id_user_id_b3c30c96_uniq UNIQUE (account_id, user_id);


--
-- Name: babybuddy_account_users babybuddy_account_users_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account_users
    ADD CONSTRAINT babybuddy_account_users_pkey PRIMARY KEY (id);


--
-- Name: babybuddy_accountmembersettings babybuddy_accountmembersettings_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountmembersettings
    ADD CONSTRAINT babybuddy_accountmembersettings_pkey PRIMARY KEY (id);


--
-- Name: babybuddy_accountpromocode babybuddy_accountpromocode_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountpromocode
    ADD CONSTRAINT babybuddy_accountpromocode_pkey PRIMARY KEY (id);


--
-- Name: babybuddy_promocode babybuddy_promocode_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_promocode
    ADD CONSTRAINT babybuddy_promocode_pkey PRIMARY KEY (id);


--
-- Name: babybuddy_settings babybuddy_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_settings
    ADD CONSTRAINT babybuddy_settings_pkey PRIMARY KEY (id);


--
-- Name: babybuddy_settings babybuddy_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_settings
    ADD CONSTRAINT babybuddy_settings_user_id_key UNIQUE (user_id);


--
-- Name: core_bath core_bath_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_bath
    ADD CONSTRAINT core_bath_pkey PRIMARY KEY (id);


--
-- Name: core_child core_child_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_child
    ADD CONSTRAINT core_child_pkey PRIMARY KEY (id);


--
-- Name: core_child core_child_slug_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_child
    ADD CONSTRAINT core_child_slug_key UNIQUE (slug);


--
-- Name: core_diaperchange core_diaperchange_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_diaperchange
    ADD CONSTRAINT core_diaperchange_pkey PRIMARY KEY (id);


--
-- Name: core_feeding core_feeding_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_feeding
    ADD CONSTRAINT core_feeding_pkey PRIMARY KEY (id);


--
-- Name: core_note core_note_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_note
    ADD CONSTRAINT core_note_pkey PRIMARY KEY (id);


--
-- Name: core_notification core_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notification
    ADD CONSTRAINT core_notification_pkey PRIMARY KEY (id);


--
-- Name: core_notificationevent core_notificationevent_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notificationevent
    ADD CONSTRAINT core_notificationevent_pkey PRIMARY KEY (id);


--
-- Name: core_sleep core_sleep_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_sleep
    ADD CONSTRAINT core_sleep_pkey PRIMARY KEY (id);


--
-- Name: core_suggestion core_suggestion_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_suggestion
    ADD CONSTRAINT core_suggestion_pkey PRIMARY KEY (id);


--
-- Name: core_temperature core_temperature_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_temperature
    ADD CONSTRAINT core_temperature_pkey PRIMARY KEY (id);


--
-- Name: core_timer core_timer_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_timer
    ADD CONSTRAINT core_timer_pkey PRIMARY KEY (id);


--
-- Name: core_tummytime core_tummytime_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_tummytime
    ADD CONSTRAINT core_tummytime_pkey PRIMARY KEY (id);


--
-- Name: core_weight core_weight_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_weight
    ADD CONSTRAINT core_weight_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: easy_thumbnails_source easy_thumbnails_source_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_source
    ADD CONSTRAINT easy_thumbnails_source_pkey PRIMARY KEY (id);


--
-- Name: easy_thumbnails_source easy_thumbnails_source_storage_hash_name_481ce32d_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_source
    ADD CONSTRAINT easy_thumbnails_source_storage_hash_name_481ce32d_uniq UNIQUE (storage_hash, name);


--
-- Name: easy_thumbnails_thumbnail easy_thumbnails_thumbnai_storage_hash_name_source_fb375270_uniq; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnail
    ADD CONSTRAINT easy_thumbnails_thumbnai_storage_hash_name_source_fb375270_uniq UNIQUE (storage_hash, name, source_id);


--
-- Name: easy_thumbnails_thumbnail easy_thumbnails_thumbnail_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnail
    ADD CONSTRAINT easy_thumbnails_thumbnail_pkey PRIMARY KEY (id);


--
-- Name: easy_thumbnails_thumbnaildimensions easy_thumbnails_thumbnaildimensions_pkey; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnaildimensions
    ADD CONSTRAINT easy_thumbnails_thumbnaildimensions_pkey PRIMARY KEY (id);


--
-- Name: easy_thumbnails_thumbnaildimensions easy_thumbnails_thumbnaildimensions_thumbnail_id_key; Type: CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnaildimensions
    ADD CONSTRAINT easy_thumbnails_thumbnaildimensions_thumbnail_id_key UNIQUE (thumbnail_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- Name: babybuddy_account_slug_4018e3d9_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX babybuddy_account_slug_4018e3d9_like ON public.babybuddy_account USING btree (slug varchar_pattern_ops);


--
-- Name: babybuddy_account_users_account_id_88e5dd46; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX babybuddy_account_users_account_id_88e5dd46 ON public.babybuddy_account_users USING btree (account_id);


--
-- Name: babybuddy_account_users_user_id_79af665d; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX babybuddy_account_users_user_id_79af665d ON public.babybuddy_account_users USING btree (user_id);


--
-- Name: babybuddy_accountmembersettings_account_id_9e8e52c2; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX babybuddy_accountmembersettings_account_id_9e8e52c2 ON public.babybuddy_accountmembersettings USING btree (account_id);


--
-- Name: babybuddy_accountmembersettings_user_id_e991cb69; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX babybuddy_accountmembersettings_user_id_e991cb69 ON public.babybuddy_accountmembersettings USING btree (user_id);


--
-- Name: babybuddy_accountpromocode_account_id_2d99185e; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX babybuddy_accountpromocode_account_id_2d99185e ON public.babybuddy_accountpromocode USING btree (account_id);


--
-- Name: babybuddy_accountpromocode_promo_code_id_ecb818a5; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX babybuddy_accountpromocode_promo_code_id_ecb818a5 ON public.babybuddy_accountpromocode USING btree (promo_code_id);


--
-- Name: child_idx; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX child_idx ON public.core_notification USING btree (child_id);


--
-- Name: core_bath_child_id_3e9a8961; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_bath_child_id_3e9a8961 ON public.core_bath USING btree (child_id);


--
-- Name: core_child_account_id_0bb4aab4; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_child_account_id_0bb4aab4 ON public.core_child USING btree (account_id);


--
-- Name: core_child_slug_13813870_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_child_slug_13813870_like ON public.core_child USING btree (slug varchar_pattern_ops);


--
-- Name: core_diaperchange_child_id_188db51b; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_diaperchange_child_id_188db51b ON public.core_diaperchange USING btree (child_id);


--
-- Name: core_feeding_child_id_3d6de167; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_feeding_child_id_3d6de167 ON public.core_feeding USING btree (child_id);


--
-- Name: core_note_child_id_5d68ed81; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_note_child_id_5d68ed81 ON public.core_note USING btree (child_id);


--
-- Name: core_notification_account_id_b6744cc8; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_notification_account_id_b6744cc8 ON public.core_notification USING btree (account_id);


--
-- Name: core_notification_child_id_3daa4d18; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_notification_child_id_3daa4d18 ON public.core_notification USING btree (child_id);


--
-- Name: core_notification_user_id_6e341aac; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_notification_user_id_6e341aac ON public.core_notification USING btree (user_id);


--
-- Name: core_notificationevent_notification_id_c422b014; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_notificationevent_notification_id_c422b014 ON public.core_notificationevent USING btree (notification_id);


--
-- Name: core_notificationevent_user_id_9bc428e6; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_notificationevent_user_id_9bc428e6 ON public.core_notificationevent USING btree (user_id);


--
-- Name: core_sleep_child_id_f63ed3ef; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_sleep_child_id_f63ed3ef ON public.core_sleep USING btree (child_id);


--
-- Name: core_suggestion_child_id_9a902a0b; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_suggestion_child_id_9a902a0b ON public.core_suggestion USING btree (child_id);


--
-- Name: core_suggestion_user_id_e2d5d75c; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_suggestion_user_id_e2d5d75c ON public.core_suggestion USING btree (user_id);


--
-- Name: core_temperature_child_id_cc2e92dc; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_temperature_child_id_cc2e92dc ON public.core_temperature USING btree (child_id);


--
-- Name: core_timer_account_id_fbb81e59; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_timer_account_id_fbb81e59 ON public.core_timer USING btree (account_id);


--
-- Name: core_timer_child_id_8f2216f0; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_timer_child_id_8f2216f0 ON public.core_timer USING btree (child_id);


--
-- Name: core_timer_user_id_c07f16b8; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_timer_user_id_c07f16b8 ON public.core_timer USING btree (user_id);


--
-- Name: core_tummytime_child_id_ebab8909; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_tummytime_child_id_ebab8909 ON public.core_tummytime USING btree (child_id);


--
-- Name: core_weight_child_id_5c558c78; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX core_weight_child_id_5c558c78 ON public.core_weight USING btree (child_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: easy_thumbnails_source_name_5fe0edc6; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_source_name_5fe0edc6 ON public.easy_thumbnails_source USING btree (name);


--
-- Name: easy_thumbnails_source_name_5fe0edc6_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_source_name_5fe0edc6_like ON public.easy_thumbnails_source USING btree (name varchar_pattern_ops);


--
-- Name: easy_thumbnails_source_storage_hash_946cbcc9; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_source_storage_hash_946cbcc9 ON public.easy_thumbnails_source USING btree (storage_hash);


--
-- Name: easy_thumbnails_source_storage_hash_946cbcc9_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_source_storage_hash_946cbcc9_like ON public.easy_thumbnails_source USING btree (storage_hash varchar_pattern_ops);


--
-- Name: easy_thumbnails_thumbnail_name_b5882c31; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_thumbnail_name_b5882c31 ON public.easy_thumbnails_thumbnail USING btree (name);


--
-- Name: easy_thumbnails_thumbnail_name_b5882c31_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_thumbnail_name_b5882c31_like ON public.easy_thumbnails_thumbnail USING btree (name varchar_pattern_ops);


--
-- Name: easy_thumbnails_thumbnail_source_id_5b57bc77; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_thumbnail_source_id_5b57bc77 ON public.easy_thumbnails_thumbnail USING btree (source_id);


--
-- Name: easy_thumbnails_thumbnail_storage_hash_f1435f49; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_thumbnail_storage_hash_f1435f49 ON public.easy_thumbnails_thumbnail USING btree (storage_hash);


--
-- Name: easy_thumbnails_thumbnail_storage_hash_f1435f49_like; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX easy_thumbnails_thumbnail_storage_hash_f1435f49_like ON public.easy_thumbnails_thumbnail USING btree (storage_hash varchar_pattern_ops);


--
-- Name: notification_idx; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX notification_idx ON public.core_notificationevent USING btree (notification_id);


--
-- Name: send_at_idx; Type: INDEX; Schema: public; Owner: babyasst
--

CREATE INDEX send_at_idx ON public.core_notificationevent USING btree (send_at);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_account babybuddy_account_owner_id_d17c4816_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account
    ADD CONSTRAINT babybuddy_account_owner_id_d17c4816_fk_auth_user_id FOREIGN KEY (owner_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_account_users babybuddy_account_us_account_id_88e5dd46_fk_babybuddy; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account_users
    ADD CONSTRAINT babybuddy_account_us_account_id_88e5dd46_fk_babybuddy FOREIGN KEY (account_id) REFERENCES public.babybuddy_account(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_account_users babybuddy_account_users_user_id_79af665d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_account_users
    ADD CONSTRAINT babybuddy_account_users_user_id_79af665d_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_accountmembersettings babybuddy_accountmem_account_id_9e8e52c2_fk_babybuddy; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountmembersettings
    ADD CONSTRAINT babybuddy_accountmem_account_id_9e8e52c2_fk_babybuddy FOREIGN KEY (account_id) REFERENCES public.babybuddy_account(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_accountmembersettings babybuddy_accountmem_user_id_e991cb69_fk_auth_user; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountmembersettings
    ADD CONSTRAINT babybuddy_accountmem_user_id_e991cb69_fk_auth_user FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_accountpromocode babybuddy_accountpro_account_id_2d99185e_fk_babybuddy; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountpromocode
    ADD CONSTRAINT babybuddy_accountpro_account_id_2d99185e_fk_babybuddy FOREIGN KEY (account_id) REFERENCES public.babybuddy_account(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_accountpromocode babybuddy_accountpro_promo_code_id_ecb818a5_fk_babybuddy; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_accountpromocode
    ADD CONSTRAINT babybuddy_accountpro_promo_code_id_ecb818a5_fk_babybuddy FOREIGN KEY (promo_code_id) REFERENCES public.babybuddy_promocode(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: babybuddy_settings babybuddy_settings_user_id_87606280_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.babybuddy_settings
    ADD CONSTRAINT babybuddy_settings_user_id_87606280_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_bath core_bath_child_id_3e9a8961_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_bath
    ADD CONSTRAINT core_bath_child_id_3e9a8961_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_child core_child_account_id_0bb4aab4_fk_babybuddy_account_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_child
    ADD CONSTRAINT core_child_account_id_0bb4aab4_fk_babybuddy_account_id FOREIGN KEY (account_id) REFERENCES public.babybuddy_account(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_diaperchange core_diaperchange_child_id_188db51b_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_diaperchange
    ADD CONSTRAINT core_diaperchange_child_id_188db51b_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_feeding core_feeding_child_id_3d6de167_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_feeding
    ADD CONSTRAINT core_feeding_child_id_3d6de167_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_note core_note_child_id_5d68ed81_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_note
    ADD CONSTRAINT core_note_child_id_5d68ed81_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_notification core_notification_account_id_b6744cc8_fk_babybuddy_account_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notification
    ADD CONSTRAINT core_notification_account_id_b6744cc8_fk_babybuddy_account_id FOREIGN KEY (account_id) REFERENCES public.babybuddy_account(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_notification core_notification_child_id_3daa4d18_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notification
    ADD CONSTRAINT core_notification_child_id_3daa4d18_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_notification core_notification_user_id_6e341aac_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notification
    ADD CONSTRAINT core_notification_user_id_6e341aac_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_notificationevent core_notificationeve_notification_id_c422b014_fk_core_noti; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notificationevent
    ADD CONSTRAINT core_notificationeve_notification_id_c422b014_fk_core_noti FOREIGN KEY (notification_id) REFERENCES public.core_notification(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_notificationevent core_notificationevent_user_id_9bc428e6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_notificationevent
    ADD CONSTRAINT core_notificationevent_user_id_9bc428e6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_sleep core_sleep_child_id_f63ed3ef_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_sleep
    ADD CONSTRAINT core_sleep_child_id_f63ed3ef_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_suggestion core_suggestion_child_id_9a902a0b_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_suggestion
    ADD CONSTRAINT core_suggestion_child_id_9a902a0b_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_suggestion core_suggestion_user_id_e2d5d75c_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_suggestion
    ADD CONSTRAINT core_suggestion_user_id_e2d5d75c_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_temperature core_temperature_child_id_cc2e92dc_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_temperature
    ADD CONSTRAINT core_temperature_child_id_cc2e92dc_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_timer core_timer_account_id_fbb81e59_fk_babybuddy_account_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_timer
    ADD CONSTRAINT core_timer_account_id_fbb81e59_fk_babybuddy_account_id FOREIGN KEY (account_id) REFERENCES public.babybuddy_account(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_timer core_timer_child_id_8f2216f0_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_timer
    ADD CONSTRAINT core_timer_child_id_8f2216f0_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_timer core_timer_user_id_c07f16b8_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_timer
    ADD CONSTRAINT core_timer_user_id_c07f16b8_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_tummytime core_tummytime_child_id_ebab8909_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_tummytime
    ADD CONSTRAINT core_tummytime_child_id_ebab8909_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_weight core_weight_child_id_5c558c78_fk_core_child_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.core_weight
    ADD CONSTRAINT core_weight_child_id_5c558c78_fk_core_child_id FOREIGN KEY (child_id) REFERENCES public.core_child(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: easy_thumbnails_thumbnail easy_thumbnails_thum_source_id_5b57bc77_fk_easy_thum; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnail
    ADD CONSTRAINT easy_thumbnails_thum_source_id_5b57bc77_fk_easy_thum FOREIGN KEY (source_id) REFERENCES public.easy_thumbnails_source(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: easy_thumbnails_thumbnaildimensions easy_thumbnails_thum_thumbnail_id_c3a0c549_fk_easy_thum; Type: FK CONSTRAINT; Schema: public; Owner: babyasst
--

ALTER TABLE ONLY public.easy_thumbnails_thumbnaildimensions
    ADD CONSTRAINT easy_thumbnails_thum_thumbnail_id_c3a0c549_fk_easy_thum FOREIGN KEY (thumbnail_id) REFERENCES public.easy_thumbnails_thumbnail(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

