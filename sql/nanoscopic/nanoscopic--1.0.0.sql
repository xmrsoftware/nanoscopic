/*
   Copyright 2021 XMR VPS Ltd

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

CREATE TABLE blog_user (
    blog_user_id BIGSERIAL PRIMARY KEY,
    blog_user_username TEXT UNIQUE NOT NULL,
    blog_user_email TEXT UNIQUE NOT NULL,
    blog_user_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    blog_user_password TEXT UNIQUE NOT NULL,
    blog_user_salt UUID UNIQUE NOT NULL,
    blog_user_registered TIMESTAMPTZ NOT NULL,
    blog_user_account_credit MONEY NOT NULL DEFAULT 0,
    blog_user_first_name TEXT,
    blog_user_last_name TEXT
);

CREATE TABLE blog (
    blog_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_name TEXT UNIQUE NOT NULL,
    blog_description TEXT NOT NULL,
    blog_created TIMESTAMPTZ NOT NULL
);

CREATE TABLE blog_post (
    blog_post_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_user_id_updater BIGINT REFERENCES blog_user(blog_user_id),
    blog_id BIGINT NOT NULL REFERENCES blog(blog_id),
    blog_post_title TEXT NOT NULL,
    blog_post_content TEXT NOT NULL,
    blog_post_views BIGINT NOT NULL DEFAULT 0,
    blog_post_published TIMESTAMPTZ NOT NULL,
    blog_post_updated TIMESTAMPTZ NOT NULL,
    blog_post_cost MONEY NOT NULL DEFAULT 0
);

CREATE TABLE blog_user_transactions (
    blog_user_transactions_id BIGSERIAL PRIMARY KEY,
    blog_user_transactions_spent MONEY NOT NULL DEFAULT 0,
    blog_user_transactions_sender_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_user_transactions_receiver_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_user_transactions_date_sent TIMESTAMPTZ NOT NULL,
    blog_post_id BIGINT NOT NULL REFERENCES blog_post(blog_post_id)
);

CREATE TABLE blog_post_cost_history (
    blog_post_cost_history_id BIGSERIAL PRIMARY KEY,
    blog_post_id BIGINT NOT NULL REFERENCES blog_post(blog_post_id),
    blog_post_cost_history_cost MONEY NOT NULL DEFAULT 0,
    blog_post_cost_history_date_cost_set TIMESTAMPTZ NOT NULL
);

CREATE TABLE blog_post_comment (
    blog_post_comment_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_user_id_updater BIGINT REFERENCES blog_user(blog_user_id),
    blog_post_id BIGINT NOT NULL REFERENCES blog_post(blog_post_id),
    blog_post_comment_content TEXT NOT NULL,
    blog_post_comment_date_posted TIMESTAMPTZ NOT NULL,
    blog_post_comment_date_updated TIMESTAMPTZ NOT NULL,
    blog_post_comment_cost MONEY NOT NULL DEFAULT 0
);

CREATE TABLE blog_post_comment_cost_history (
    blog_post_comment_cost_history_id BIGSERIAL PRIMARY KEY,
    blog_post_id BIGINT NOT NULL REFERENCES blog_post(blog_post_id),
    blog_post_comment_cost_history_cost MONEY NOT NULL DEFAULT 0,
    blog_post_comment_cost_history_date_cost_set TIMESTAMPTZ NOT NULL
);