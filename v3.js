import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { BASE_URL, TOKEN, INSTR_TOKEN, INSTR_SYMBOL } from './config/environment.js';

export let options = {
    stages: [
        { duration: '10s', target: 5 },
        { duration: '15s', target: 20 },
    ],
};

// Define metrics globally
const failedRequests = new Counter('failed_requests');
const status2xx = new Counter('status_2xx');
const status4xx = new Counter('status_4xx');
const status5xx = new Counter('status_5xx');

// Static Trends for all endpoints
const trends = {
    fetch_instruments: new Trend('fetch_instruments_duration'),
    fetch_instrument_categories: new Trend('fetch_instrument_categories_duration'),
    fetch_chart_symbol: new Trend('fetch_chart_symbol_duration'),
    find_instrument_by_symbol: new Trend('find_instrument_by_symbol_duration'),
    find_instrument_by_token: new Trend('find_instrument_by_token_duration'),
    fetch_watchlist_ids: new Trend('fetch_watchlist_ids_duration'),
    fetch_watchlists: new Trend('fetch_watchlists_duration'),
    fetch_notifications: new Trend('fetch_notifications_duration'),
    read_all_notifications: new Trend('read_all_notifications_duration'),
    unread_notification_counts: new Trend('unread_notification_counts_duration'),
    fetch_markets: new Trend('fetch_markets_duration'),
    fetch_forecasts: new Trend('fetch_forecasts_duration'),
    fetch_accuracies: new Trend('fetch_accuracies_duration'),
    fetch_correlations: new Trend('fetch_correlations_duration'),
    fetch_sentiments: new Trend('fetch_sentiments_duration'),
    fetch_owned_subscriptions: new Trend('fetch_owned_subscriptions_duration'),
    fetch_subscription_plans: new Trend('fetch_subscription_plans_duration'),
    fetch_subscription_instruments: new Trend('fetch_subscription_instruments_duration'),
    fetch_user_devices: new Trend('fetch_user_devices_duration'),
    update_last_login: new Trend('update_last_login_duration'),
    fetch_user_profile: new Trend('fetch_user_profile_duration'),
    fetch_referral_info: new Trend('fetch_referral_info_duration'),
};

const responseSizes = {
    fetch_instruments: new Trend('fetch_instruments_size'),
    fetch_instrument_categories: new Trend('fetch_instrument_categories_size'),
    fetch_chart_symbol: new Trend('fetch_chart_symbol_size'),
    find_instrument_by_symbol: new Trend('find_instrument_by_symbol_size'),
    find_instrument_by_token: new Trend('find_instrument_by_token_size'),
    fetch_watchlist_ids: new Trend('fetch_watchlist_ids_size'),
    fetch_watchlists: new Trend('fetch_watchlists_size'),
    fetch_notifications: new Trend('fetch_notifications_size'),
    read_all_notifications: new Trend('read_all_notifications_size'),
    unread_notification_counts: new Trend('unread_notification_counts_size'),
    fetch_markets: new Trend('fetch_markets_size'),
    fetch_forecasts: new Trend('fetch_forecasts_size'),
    fetch_accuracies: new Trend('fetch_accuracies_size'),
    fetch_correlations: new Trend('fetch_correlations_size'),
    fetch_sentiments: new Trend('fetch_sentiments_size'),
    fetch_owned_subscriptions: new Trend('fetch_owned_subscriptions_size'),
    fetch_subscription_plans: new Trend('fetch_subscription_plans_size'),
    fetch_subscription_instruments: new Trend('fetch_subscription_instruments_size'),
    fetch_user_devices: new Trend('fetch_user_devices_size'),
    update_last_login: new Trend('update_last_login_size'),
    fetch_user_profile: new Trend('fetch_user_profile_size'),
    fetch_referral_info: new Trend('fetch_referral_info_size'),
};

const headers = {
    headers: { Authorization: `Bearer ${TOKEN}` },
    timeout: '2s'
};

export default function () {
    handleRequest('fetch_instruments', `${BASE_URL}/instruments`);
    handleRequest('fetch_instrument_categories', `${BASE_URL}/instruments/categories`);
    handleRequest('fetch_chart_symbol', `${BASE_URL}/instruments/fetch-chart-symbol`);
    handleRequest('find_instrument_by_symbol', `${BASE_URL}/instruments/find-by-symbol/${INSTR_SYMBOL}`);
    handleRequest('find_instrument_by_token', `${BASE_URL}/instruments/find-by-token/${INSTR_TOKEN}`);
    handleRequest('fetch_watchlist_ids', `${BASE_URL}/instruments/watchlist-ids`);
    handleRequest('fetch_watchlists', `${BASE_URL}/instruments/watchlists`);
    handleRequest('fetch_notifications', `${BASE_URL}/notifications`);
    handleRequest('read_all_notifications', `${BASE_URL}/notifications/read-all`);
    handleRequest('unread_notification_counts', `${BASE_URL}/notifications/unread-counts`);
    handleRequest('fetch_markets', `${BASE_URL}/predict/markets?token=${INSTR_TOKEN}&interval=60&from_date=2025-04-04%2007:55:30&to_date=2025-04-24%2013:25:30`);
    handleRequest('fetch_forecasts', `${BASE_URL}/predict/forecasts?token=${INSTR_TOKEN}&from_date=2025-03-24%2020:00:00&to_date=2025-03-27%2008:00:00&timeframe=15`);
    handleRequest('fetch_accuracies', `${BASE_URL}/predict/insights/accuracy?token=${INSTR_TOKEN}&to_date=2025-04-24`);
    handleRequest('fetch_correlations', `${BASE_URL}/predict/insights/correlation?token=${INSTR_TOKEN}&to_date=2025-04-24`);
    handleRequest('fetch_sentiments', `${BASE_URL}/predict/insights/sentiment?token=${INSTR_TOKEN}&to_date=2025-04-24`);
    handleRequest('fetch_owned_subscriptions', `${BASE_URL}/subscriptions/owned`);
    handleRequest('fetch_subscription_plans', `${BASE_URL}/subscriptions/plans?currency_id=USD`);
    handleRequest('fetch_subscription_instruments', `${BASE_URL}/subscriptions/plans/instruments?subscription_plan_id=1`);
    handleRequest('fetch_user_devices', `${BASE_URL}/users/devices`);
    handleRequest('update_last_login', `${BASE_URL}/users/devices/update-last-login`);
    handleRequest('fetch_user_profile', `${BASE_URL}/users/get-profile`);
    handleRequest('fetch_referral_info', `${BASE_URL}/users/referral-info`);

    sleep(1);
}

function handleRequest(name, url) {
    const res = http.get(url, headers);

    trends[name].add(res.timings.duration);
    responseSizes[name].add(res.body.length);

    if (res.status >= 200 && res.status < 300) status2xx.add(1);
    else if (res.status >= 400 && res.status < 500) status4xx.add(1);
    else if (res.status >= 500) status5xx.add(1);

    if (res.status !== 200) failedRequests.add(1);

    check(res, {
        [`${name} - status 200`]: (r) => r.status === 200,
        [`${name} - duration < 1000ms`]: (r) => r.timings.duration < 1000,
    });
}
