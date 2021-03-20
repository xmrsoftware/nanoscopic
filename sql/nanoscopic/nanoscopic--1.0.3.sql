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

ALTER TABLE blog_user
ADD CONSTRAINT blog_user_account_balance
CHECK (
    blog_user_account_credit >= 0::money
);

ALTER TABLE blog_post
ADD CONSTRAINT num_blog_post_views
CHECK (
    blog_post_views >= 0
);

ALTER TABLE blog_post
ADD CONSTRAINT blog_post_cost_to_view
CHECK (
    blog_post_cost >= 0::money
);

ALTER TABLE blog_post_comment
ADD CONSTRAINT blog_post_comment_cost_to_post
CHECK (
    blog_post_comment_cost >= 0::money
);

ALTER TABLE  blog_post_comment_cost_history
ADD CONSTRAINT blog_post_comment_cost_history_amount
CHECK (
    blog_post_comment_cost_history_cost >= 0::money
);

ALTER TABLE blog_post_cost_history
ADD CONSTRAINT blog_post_cost_history_amount
CHECK (
    blog_post_cost_history_cost >= 0::money
);

ALTER TABLE blog_user_transactions
ADD CONSTRAINT blog_user_transactions_amount_spent
CHECK (
    blog_user_transactions_spent >= 0::money
);