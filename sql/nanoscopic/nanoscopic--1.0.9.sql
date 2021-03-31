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

CREATE OR REPLACE FUNCTION get_user_salt (IN _blog_username TEXT) RETURNS UUID AS
    'SELECT blog_user_salt FROM blog_user WHERE blog_user_username = _blog_username;'
    LANGUAGE SQL;

CREATE TABLE blog_user_permissions (
    blog_user_permissions_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_user_permissions_blog BOOLEAN DEFAULT TRUE,
    blog_user_permissions_pages BOOLEAN DEFAULT TRUE,
    blog_user_permissions_posts BOOLEAN DEFAULT TRUE,
    blog_user_permissions_comments BOOLEAN DEFAULT TRUE,
    blog_user_permissions_can_charge_money BOOLEAN DEFAULT FALSE,
    blog_user_permissions_is_admin BOOLEAN DEFAULT FALSE,
    blog_user_permissions_is_banned BOOLEAN DEFAULT FALSE
);

CREATE OR REPLACE PROCEDURE add_user_permissions (IN _blog_user_id BIGINT) AS
    'INSERT INTO blog_user_permissions (blog_user_id) VALUES (_blog_user_id);'
    LANGUAGE SQL;

ALTER TABLE blog_user_permissions ALTER COLUMN blog_user_permissions_blog SET NOT NULL;
ALTER TABLE blog_user_permissions ALTER COLUMN blog_user_permissions_pages SET NOT NULL;
ALTER TABLE blog_user_permissions ALTER COLUMN blog_user_permissions_posts SET NOT NULL;
ALTER TABLE blog_user_permissions ALTER COLUMN blog_user_permissions_comments SET NOT NULL;
ALTER TABLE blog_user_permissions ALTER COLUMN blog_user_permissions_can_charge_money SET NOT NULL;
ALTER TABLE blog_user_permissions ALTER COLUMN blog_user_permissions_is_admin SET NOT NULL;
ALTER TABLE blog_user_permissions ALTER COLUMN blog_user_permissions_is_banned SET NOT NULL;