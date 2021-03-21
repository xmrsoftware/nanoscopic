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

CREATE OR REPLACE PROCEDURE create_blog_user (_username TEXT, _email TEXT, _password TEXT, _uuid UUID)
    LANGUAGE SQL
    AS $BODY$
        INSERT INTO blog_user (blog_user_username, blog_user_email, blog_user_password, blog_user_salt,
                               blog_user_registered)
            VALUES (_username, _email, _password, _uuid, current_timestamp);
    $BODY$;

CREATE OR REPLACE PROCEDURE create_blog (_user_id BIGINT, _name TEXT, _description TEXT)
    LANGUAGE SQL
    AS $BODY$
        INSERT INTO blog (blog_user_id, blog_name, blog_description, blog_created)
        VALUES (_user_id, _name, _description, current_timestamp);
    $BODY$;

CREATE OR REPLACE PROCEDURE create_blog_post (_title TEXT, _content TEXT, _cost MONEY, _user_id BIGINT, _blog_id BIGINT)
    LANGUAGE SQL
    AS $BODY$
        INSERT INTO blog_post (blog_post_title, blog_post_content, blog_post_published, blog_post_updated,
                               blog_post_cost, blog_user_id, blog_id)
        VALUES (_title, _content, current_timestamp, current_timestamp, _cost, _user_id, _blog_id)
    $BODY$;

CREATE OR REPLACE FUNCTION get_username_by_userid (IN _user_id BIGINT, OUT username TEXT) RETURNS TEXT AS $$
        SELECT blog_user_username AS username FROM blog_user WHERE blog_user_id = _user_id
    $$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_latest_ten_blog_posts (IN _blog_id BIGINT)
    RETURNS TABLE (_user_id BIGINT, _title TEXT, _content TEXT, _published TIMESTAMPTZ, _updated TIMESTAMPTZ) AS $$
        SELECT blog_user_id, blog_post_title, blog_post_content, blog_post_published, blog_post_updated FROM blog_post
        WHERE blog_id = _blog_id ORDER BY blog_post_published DESC LIMIT 10
    $$ LANGUAGE SQL;