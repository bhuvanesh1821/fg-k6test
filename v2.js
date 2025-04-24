import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { BASE_URL, TOKEN, INSTR_TOKEN, INSTR_SYMBOL } from './config/environment.js';

export let options = {
    stages: [
        { duration: '10s', target: 5 },
        { duration: '15s', target: 20 },
    ],
};

const headers = {
    headers: { Authorization: `Bearer ${TOKEN}` },
    'Content-Type': 'application/json',
};

// Define Trend metrics for each API
const trends = {
    fetchInstruments: new Trend('fetch_instruments'),
    fetchInstrumentCategories: new Trend('fetch_instrument_categories'),
    fetchChartSymbol: new Trend('fetch_chart_symbol'),
    findInstrumentBySymbol: new Trend('find_instrument_by_symbol'),
    findInstrumentByToken: new Trend('find_instrument_by_token'),
    fetchWatchlistIds: new Trend('fetch_watchlist_ids'),
    fetchWatchlists: new Trend('fetch_watchlists'),
    fetchNotifications: new Trend('fetch_notifications'),
    readAllNotifications: new Trend('read_all_notifications'),
    unreadNotificationCounts: new Trend('unread_notification_counts'),
    fetchMarkets: new Trend('fetch_markets'),
    fetchForecasts: new Trend('fetch_forecasts'),
    fetchAccuracies: new Trend('fetch_accuracies'),
    fetchCorrelations: new Trend('fetch_correlations'),
    fetchSentiments: new Trend('fetch_sentiments'),
    fetchOwnedSubscriptions: new Trend('fetch_owned_subscriptions'),
    fetchSubscriptionPlans: new Trend('fetch_subscription_plans'),
    fetchSubscriptionInstruments: new Trend('fetch_subscription_instruments'),
    fetchUserDevices: new Trend('fetch_user_devices'),
    updateLastLogin: new Trend('update_last_login'),
    fetchUserProfile: new Trend('fetch_user_profile'),
    fetchReferralInfo: new Trend('fetch_referral_info'),
};

const checkResult = (response, name, code, trendMetric) => {
    const duration = response.timings.duration;
    trendMetric.add(duration);

    check(response, {
        [`${name} status is ${code}`]: (r) => r.status === code,
        [`${name} response time < 1000ms`]: () => duration < 1000,
    });
};

export default function () {
    fetchInstruments();
    fetchInstrumentCategories();
    fetchChartSymbol();
    findInstrumentBySymbol();
    findInstrumentByToken();
    fetchWatchlistIds();
    fetchWatchlists();
    fetchNotifications();
    readAllNotifications();
    unreadNotificationCounts();
    fetchMarkets();
    fetchForecasts();
    fetchAccuracies();
    fetchCorrelations();
    fetchSentiments();
    fetchOwnedSubscriptions();
    fetchSubscriptionPlans();
    fetchSubscriptionInstruments();
    fetchUserDevices();
    updateLastLogin();
    fetchUserProfile();
    fetchReferralInfo();

    sleep(1);
}

// API Call Functions

function fetchInstruments() {
    const res = http.get(`${BASE_URL}/instruments`, headers);
    checkResult(res, 'fetch instruments', 200, trends.fetchInstruments);
}

function fetchInstrumentCategories() {
    const res = http.get(`${BASE_URL}/instruments/categories`, headers);
    checkResult(res, 'fetch instrument categories', 200, trends.fetchInstrumentCategories);
}

function fetchChartSymbol() {
    const res = http.get(`${BASE_URL}/instruments/fetch-chart-symbol`, headers);
    checkResult(res, 'fetch chart symbol', 200, trends.fetchChartSymbol);
}

function findInstrumentBySymbol() {
    const res = http.get(`${BASE_URL}/instruments/find-by-symbol/${INSTR_SYMBOL}`, headers);
    checkResult(res, 'find instrument by symbol', 200, trends.findInstrumentBySymbol);
}

function findInstrumentByToken() {
    const res = http.get(`${BASE_URL}/instruments/find-by-token/${INSTR_TOKEN}`, headers);
    checkResult(res, 'find instrument by token', 200, trends.findInstrumentByToken);
}

function fetchWatchlistIds() {
    const res = http.get(`${BASE_URL}/instruments/watchlist-ids`, headers);
    checkResult(res, 'fetch watchlist ids', 200, trends.fetchWatchlistIds);
}

function fetchWatchlists() {
    const res = http.get(`${BASE_URL}/instruments/watchlists`, headers);
    checkResult(res, 'fetch watchlists', 200, trends.fetchWatchlists);
}

function fetchNotifications() {
    const res = http.get(`${BASE_URL}/notifications`, headers);
    checkResult(res, 'fetch notifications', 200, trends.fetchNotifications);
}

function readAllNotifications() {
    const res = http.get(`${BASE_URL}/notifications/read-all`, headers);
    checkResult(res, 'read all notifications', 200, trends.readAllNotifications);
}

function unreadNotificationCounts() {
    const res = http.get(`${BASE_URL}/notifications/unread-counts`, headers);
    checkResult(res, 'unread notification counts', 200, trends.unreadNotificationCounts);
}

function fetchMarkets() {
    const res = http.get(`${BASE_URL}/predict/markets?token=${INSTR_TOKEN}&interval=60&from_date=2025-04-04%2007:55:30&to_date=2025-04-24%2013:25:30`, headers);
    checkResult(res, 'fetch markets', 200, trends.fetchMarkets);
}

function fetchForecasts() {
    const res = http.get(`${BASE_URL}/predict/forecasts?token=${INSTR_TOKEN}&from_date=2025-03-24%2020:00:00&to_date=2025-03-27%2008:00:00&timeframe=15`, headers);
    checkResult(res, 'fetch forecasts', 200, trends.fetchForecasts);
}

function fetchAccuracies() {
    const res = http.get(`${BASE_URL}/predict/insights/accuracy?token=${INSTR_TOKEN}&to_date=2025-04-24`, headers);
    checkResult(res, 'fetch accuracies', 200, trends.fetchAccuracies);
}

function fetchCorrelations() {
    const res = http.get(`${BASE_URL}/predict/insights/correlation?token=${INSTR_TOKEN}&to_date=2025-04-24`, headers);
    checkResult(res, 'fetch correlations', 200, trends.fetchCorrelations);
}

function fetchSentiments() {
    const res = http.get(`${BASE_URL}/predict/insights/sentiment?token=${INSTR_TOKEN}&to_date=2025-04-24`, headers);
    checkResult(res, 'fetch sentiments', 200, trends.fetchSentiments);
}

function fetchOwnedSubscriptions() {
    const res = http.get(`${BASE_URL}/subscriptions/owned`, headers);
    checkResult(res, 'fetch owned subscriptions', 200, trends.fetchOwnedSubscriptions);
}

function fetchSubscriptionPlans() {
    const res = http.get(`${BASE_URL}/subscriptions/plans?currency_id=USD`, headers);
    checkResult(res, 'fetch subscription plans', 200, trends.fetchSubscriptionPlans);
}

function fetchSubscriptionInstruments() {
    const res = http.get(`${BASE_URL}/subscriptions/plans/instruments?subscription_plan_id=1`, headers);
    checkResult(res, 'fetch subscription plan instruments', 200, trends.fetchSubscriptionInstruments);
}

function fetchUserDevices() {
    const res = http.get(`${BASE_URL}/users/devices`, headers);
    checkResult(res, 'fetch user devices', 200, trends.fetchUserDevices);
}

function updateLastLogin() {
    const res = http.get(`${BASE_URL}/users/devices/update-last-login`, headers);
    checkResult(res, 'update last login', 200, trends.updateLastLogin);
}

function fetchUserProfile() {
    const res = http.get(`${BASE_URL}/users/get-profile`, headers);
    checkResult(res, 'fetch user profile', 200, trends.fetchUserProfile);
}

function fetchReferralInfo() {
    const res = http.get(`${BASE_URL}/users/referral-info`, headers);
    checkResult(res, 'fetch referral info', 200, trends.fetchReferralInfo);
}
