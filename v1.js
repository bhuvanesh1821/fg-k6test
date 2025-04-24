import http from 'k6/http';
import { check, sleep } from 'k6';
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

const checkResult = (response, name, code) => {
    check(response, {
        [`${name} status is ${code}`]: (r) => r.status === code,
        [`${name} response time < 1000ms`]: (r) => r.timings.duration < 1000,
    });
};

function fetchInstruments() {
    const res = http.get(`${BASE_URL}/instruments`, headers);
    checkResult(res, 'fetch instruments', 200);
}

function fetchInstrumentCategories() {
    const res = http.get(`${BASE_URL}/instruments/categories`, headers);
    checkResult(res, 'fetch instrument categories', 200);
}

function fetchChartSymbol() {
    const res = http.get(`${BASE_URL}/instruments/fetch-chart-symbol`, headers);
    checkResult(res, 'fetch chart symbol', 200);
}

function findInstrumentBySymbol() {
    const res = http.get(`${BASE_URL}/instruments/find-by-symbol/${INSTR_SYMBOL}`, headers);
    checkResult(res, 'find instrument by symbol', 200);
}

function findInstrumentByToken() {
    const res = http.get(`${BASE_URL}/instruments/find-by-token/${INSTR_TOKEN}`, headers);
    checkResult(res, 'find instrument by token', 200);
}

function fetchWatchlistIds() {
    const res = http.get(`${BASE_URL}/instruments/watchlist-ids`, headers);
    checkResult(res, 'fetch watchlist ids', 200);
}

function fetchWatchlists() {
    const res = http.get(`${BASE_URL}/instruments/watchlists`, headers);
    checkResult(res, 'fetch watchlists', 200);
}

function fetchNotifications() {
    const res = http.get(`${BASE_URL}/notifications`, headers);
    checkResult(res, 'fetch notifications', 200);
}

function readAllNotifications() {
    const res = http.get(`${BASE_URL}/notifications/read-all`, headers);
    checkResult(res, 'fetch read all notifications', 200);
}

function unreadNotificationCounts() {
    const res = http.get(`${BASE_URL}/notifications/unread-counts`, headers);
    checkResult(res, 'unread notification counts', 200);
}

function fetchMarkets() {
    const res = http.get(`${BASE_URL}/predict/markets?token=${INSTR_TOKEN}&interval=60&from_date=2025-04-04%2007:55:30&to_date=2025-04-24%2013:25:30`, headers);
    checkResult(res, 'fetch markets', 200);
}

function fetchForecasts() {
    const res = http.get(`${BASE_URL}/predict/forecasts?token=${INSTR_TOKEN}&from_date=2025-03-24%2020:00:00&to_date=2025-03-27%2008:00:00&timeframe=15`, headers);
    checkResult(res, 'fetch forecasts', 200);
}

function fetchAccuracies() {
    const res = http.get(`${BASE_URL}/predict/insights/accuracy?token=${INSTR_TOKEN}&to_date=2025-04-24`, headers);
    checkResult(res, 'fetch accuracies', 200);
}

function fetchCorrelations() {
    const res = http.get(`${BASE_URL}/predict/insights/correlation?token=${INSTR_TOKEN}&to_date=2025-04-24`, headers);
    checkResult(res, 'fetch correlations', 200);
}

function fetchSentiments() {
    const res = http.get(`${BASE_URL}/predict/insights/sentiment?token=${INSTR_TOKEN}&to_date=2025-04-24`, headers);
    checkResult(res, 'fetch sentiments', 200);
}

function fetchOwnedSubscriptions() {
    const res = http.get(`${BASE_URL}/subscriptions/owned`, headers);
    checkResult(res, 'fetch owned subscriptions', 200);
}

function fetchSubscriptionPlans() {
    const res = http.get(`${BASE_URL}/subscriptions/plans?currency_id=USD`, headers);
    checkResult(res, 'fetch subscription plans', 200);
}

function fetchSubscriptionInstruments() {
    const res = http.get(`${BASE_URL}/subscriptions/plans/instruments?subscription_plan_id=1`, headers);
    checkResult(res, 'fetch subscription plan instruments', 200);
}

function fetchUserDevices() {
    const res = http.get(`${BASE_URL}/users/devices`, headers);
    checkResult(res, 'fetch user devices', 200);
}

function updateLastLogin() {
    const res = http.get(`${BASE_URL}/users/devices/update-last-login`, headers);
    checkResult(res, 'update last login', 200);
}

function fetchUserProfile() {
    const res = http.get(`${BASE_URL}/users/get-profile`, headers);
    checkResult(res, 'fetch user profile', 200);
}

function fetchReferralInfo() {
    const res = http.get(`${BASE_URL}/users/referral-info`, headers);
    checkResult(res, 'fetch referral info', 200);
}