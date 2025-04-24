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
    Api_instruments: new Trend('Api_instruments_duration'),
    Api_instrument_categories: new Trend('Api_instrument_categories_duration'),
    Api_fetch_chart_symbol: new Trend('Api_fetch_chart_symbol_duration'),
    Api_instruments_find_by_symbol: new Trend('Api_instruments_find_by_symbol_duration'),
    Api_instruments_find_by_token: new Trend('Api_instruments_find_by_token_duration'),
    Api_instruments_watchlist_ids: new Trend('Api_instruments_watchlist_ids_duration'),
    Api_instruments_watchlists: new Trend('Api_instruments_watchlists_duration'),
    Api_notifications: new Trend('Api_notifications_duration'),
    Api_notifications_read_all: new Trend('Api_notifications_read_all_duration'),
    Api_notifications_unread_counts: new Trend('Api_notifications_unread_counts_duration'),
    Api_market: new Trend('Api_market_duration'),
    Api_forecast: new Trend('Api_forecast_duration'),
    Api_accuracy: new Trend('Api_accuracy_duration'),
    Api_correlation: new Trend('Api_correlation_duration'),
    Api_sentiment: new Trend('Api_sentiment_duration'),
    Api_subscriptions_owned: new Trend('Api_subscriptions_owned_duration'),
    Api_subscriptions_plans: new Trend('Api_subscriptions_plans_duration'),
    Api_subscriptions_plans_instruments: new Trend('Api_subscriptions_plans_instruments_duration'),
    Api_users_devices: new Trend('Api_users_devices_duration'),
    Api_users_devices_update_last_login: new Trend('Api_users_devices_update_last_login_duration'),
    Api_users_profile: new Trend('Api_users_profile_duration'),
    Api_users_referral_info: new Trend('Api_users_referral_info_duration'),
};

const responseSizes = {
    Api_instruments: new Trend('Api_instruments_size'),
    Api_instrument_categories: new Trend('Api_instrument_categories_size'),
    Api_fetch_chart_symbol: new Trend('Api_fetch_chart_symbol_size'),
    Api_instruments_find_by_symbol: new Trend('Api_instruments_find_by_symbol_size'),
    Api_instruments_find_by_token: new Trend('Api_instruments_find_by_token_size'),
    Api_instruments_watchlist_ids: new Trend('Api_instruments_watchlist_ids_size'),
    Api_instruments_watchlists: new Trend('Api_instruments_watchlists_size'),
    Api_notifications: new Trend('Api_notifications_size'),
    Api_notifications_read_all: new Trend('Api_notifications_read_all_size'),
    Api_notifications_unread_counts: new Trend('Api_notifications_unread_counts_size'),
    Api_market: new Trend('Api_market_size'),
    Api_forecast: new Trend('Api_forecast_size'),
    Api_accuracy: new Trend('Api_accuracy_size'),
    Api_correlation: new Trend('Api_correlation_size'),
    Api_sentiment: new Trend('Api_sentiment_size'),
    Api_subscriptions_owned: new Trend('Api_subscriptions_owned_size'),
    Api_subscriptions_plans: new Trend('Api_subscriptions_plans_size'),
    Api_subscriptions_plans_instruments: new Trend('Api_subscriptions_plans_instruments_size'),
    Api_users_devices: new Trend('Api_users_devices_size'),
    Api_users_devices_update_last_login: new Trend('Api_users_devices_update_last_login_size'),
    Api_users_profile: new Trend('Api_users_profile_size'),
    Api_users_referral_info: new Trend('Api_users_referral_info_size'),
};

const headers = {
    headers: { Authorization: `Bearer ${TOKEN}` },
    timeout: '2s'
};

export default function () {
    handleRequest('Api_instruments', `${BASE_URL}/instruments`);
    handleRequest('Api_instrument_categories', `${BASE_URL}/instruments/categories`);
    handleRequest('Api_fetch_chart_symbol', `${BASE_URL}/instruments/fetch-chart-symbol`);
    handleRequest('Api_instruments_find_by_symbol', `${BASE_URL}/instruments/find-by-symbol/${INSTR_SYMBOL}`);
    handleRequest('Api_instruments_find_by_token', `${BASE_URL}/instruments/find-by-token/${INSTR_TOKEN}`);
    handleRequest('Api_instruments_watchlist_ids', `${BASE_URL}/instruments/watchlist-ids`);
    handleRequest('Api_instruments_watchlists', `${BASE_URL}/instruments/watchlists`);
    handleRequest('Api_notifications', `${BASE_URL}/notifications`);
    handleRequest('Api_notifications_read_all', `${BASE_URL}/notifications/read-all`);
    handleRequest('Api_notifications_unread_counts', `${BASE_URL}/notifications/unread-counts`);
    handleRequest('Api_market', `${BASE_URL}/predict/markets?token=${INSTR_TOKEN}&interval=60&from_date=2025-04-04%2007:55:30&to_date=2025-04-24%2013:25:30`);
    handleRequest('Api_forecast', `${BASE_URL}/predict/forecasts?token=${INSTR_TOKEN}&from_date=2025-03-24%2020:00:00&to_date=2025-03-27%2008:00:00&timeframe=15`);
    handleRequest('Api_accuracy', `${BASE_URL}/predict/insights/accuracy?token=${INSTR_TOKEN}&to_date=2025-04-24`);
    handleRequest('Api_correlation', `${BASE_URL}/predict/insights/correlation?token=${INSTR_TOKEN}&to_date=2025-04-24`);
    handleRequest('Api_sentiment', `${BASE_URL}/predict/insights/sentiment?token=${INSTR_TOKEN}&to_date=2025-04-24`);
    handleRequest('Api_subscriptions_owned', `${BASE_URL}/subscriptions/owned`);
    handleRequest('Api_subscriptions_plans', `${BASE_URL}/subscriptions/plans?currency_id=USD`);
    handleRequest('Api_subscriptions_plans_instruments', `${BASE_URL}/subscriptions/plans/instruments?subscription_plan_id=1`);
    handleRequest('Api_users_devices', `${BASE_URL}/users/devices`);
    handleRequest('Api_users_devices_update_last_login', `${BASE_URL}/users/devices/update-last-login`);
    handleRequest('Api_users_profile', `${BASE_URL}/users/get-profile`);
    handleRequest('Api_users_referral_info', `${BASE_URL}/users/referral-info`);

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
