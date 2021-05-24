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
    blog_user_email_verification_code UUID UNIQUE NOT NULL,
    blog_user_mailing_list_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
    blog_user_password TEXT UNIQUE NOT NULL,
    blog_user_salt UUID UNIQUE NOT NULL,
    blog_user_registered TIMESTAMPTZ NOT NULL,
    blog_user_account_credit NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK ( blog_user_account_credit >= 0 ),
    blog_user_account_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    blog_user_url_slug TEXT NOT NULL
);

SELECT pg_catalog.pg_extension_config_dump('blog_user', '');
SELECT pg_catalog.pg_extension_config_dump('blog_user_blog_user_id_seq', '');

CREATE TABLE blog (
    blog_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_title TEXT UNIQUE NOT NULL,
    blog_header TEXT NOT NULL,
    blog_description TEXT NOT NULL,
    blog_created TIMESTAMPTZ NOT NULL,
    blog_url_slug TEXT NOT NULL,
    blog_meta_description TEXT NOT NULL
);

SELECT pg_catalog.pg_extension_config_dump('blog', '');
SELECT pg_catalog.pg_extension_config_dump('blog_blog_id_seq', '');

CREATE TABLE blog_post (
    blog_post_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_id BIGINT NOT NULL REFERENCES blog(blog_id) ON DELETE CASCADE,
    blog_post_title TEXT NOT NULL,
    blog_post_header TEXT NOT NULL,
    blog_post_content TEXT NOT NULL,
    blog_post_views BIGINT NOT NULL DEFAULT 0 CHECK ( blog_post_views >= 0 ),
    blog_post_published TIMESTAMPTZ NOT NULL,
    blog_post_updated TIMESTAMPTZ NOT NULL,
    blog_post_url_slug TEXT NOT NULL,
    blog_post_meta_description TEXT NOT NULL,
    blog_post_free_content TEXT NOT NULL,
    blog_post_show_on_front_page BOOLEAN NOT NULL DEFAULT FALSE
);

SELECT pg_catalog.pg_extension_config_dump('blog_post', '');
SELECT pg_catalog.pg_extension_config_dump('blog_post_blog_post_id_seq', '');

CREATE TABLE blog_post_comment (
    blog_post_comment_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_post_id BIGINT NOT NULL REFERENCES blog_post(blog_post_id) ON DELETE CASCADE,
    blog_id BIGINT NOT NULL REFERENCES blog(blog_id) ON DELETE CASCADE,
    blog_post_comment_reply_to BIGINT REFERENCES blog_post_comment(blog_post_comment_id),
    blog_post_comment_title TEXT NOT NULL,
    blog_post_comment_content TEXT NOT NULL,
    blog_post_comment_date_posted TIMESTAMPTZ NOT NULL,
    blog_post_comment_date_updated TIMESTAMPTZ NOT NULL
);

SELECT pg_catalog.pg_extension_config_dump('blog_post_comment', '');
SELECT pg_catalog.pg_extension_config_dump('blog_post_comment_blog_post_comment_id_seq', '');

CREATE TABLE blog_page (
    blog_page_id BIGSERIAL PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES blog(blog_id) ON DELETE CASCADE,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_page_title TEXT NOT NULL,
    blog_page_header TEXT NOT NULL,
    blog_page_content TEXT NOT NULL,
    blog_page_meta_description TEXT NOT NULL,
    blog_page_url_slug TEXT NOT NULL,
    blog_page_show_on_front_page BOOLEAN NOT NULL DEFAULT FALSE
);

SELECT pg_catalog.pg_extension_config_dump('blog_page', '');
SELECT pg_catalog.pg_extension_config_dump('blog_page_blog_page_id_seq', '');

CREATE TABLE blog_user_permissions (
    blog_user_permissions_id BIGSERIAL PRIMARY KEY,
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_user_permissions_blog BOOLEAN NOT NULL DEFAULT TRUE,
    blog_user_permissions_pages BOOLEAN NOT NULL DEFAULT TRUE,
    blog_user_permissions_posts BOOLEAN NOT NULL DEFAULT TRUE,
    blog_user_permissions_comments BOOLEAN NOT NULL DEFAULT TRUE,
    blog_user_permissions_can_charge_money BOOLEAN NOT NULL DEFAULT FALSE,
    blog_user_permissions_is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    blog_user_permissions_is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    blog_user_permissions_can_upload_video BOOLEAN NOT NULL DEFAULT FALSE,
    blog_user_permissions_can_upload_sound BOOLEAN NOT NULL DEFAULT FALSE,
    blog_user_permissions_is_moderator BOOLEAN NOT NULL DEFAULT FALSE
);

SELECT pg_catalog.pg_extension_config_dump('blog_user_permissions', '');
SELECT pg_catalog.pg_extension_config_dump('blog_user_permissions_blog_user_permissions_id_seq', '');

CREATE OR REPLACE PROCEDURE create_blog_user(IN _username TEXT, IN _email TEXT, IN _password TEXT, IN _salt UUID,
    IN _url_slug TEXT, IN _email_verification_code UUID)
    LANGUAGE SQL AS $$
        INSERT INTO blog_user(blog_user_username, blog_user_email, blog_user_password, blog_user_salt,
                              blog_user_registered, blog_user_url_slug, blog_user_email_verification_code)
        VALUES (_username, _email, _password, _salt, current_timestamp, _url_slug, _email_verification_code);
    $$;

CREATE OR REPLACE PROCEDURE create_blog(IN _user_id BIGINT, IN _description TEXT, IN _url_slug TEXT,
    IN _blog_title TEXT, IN _blog_header TEXT, IN _meta_desc TEXT)
    LANGUAGE SQL AS $$
        INSERT INTO blog(blog_user_id, blog_description, blog_created, blog_url_slug, blog_title,
                         blog_header, blog_meta_description) VALUES (_user_id, _description, current_timestamp,
            _url_slug, _blog_title, _blog_header, _meta_desc);
    $$;

CREATE OR REPLACE FUNCTION get_username_by_userid(IN _user_id BIGINT, OUT username TEXT) RETURNS TEXT
    LANGUAGE SQL AS $$
        SELECT blog_user_username AS username FROM blog_user WHERE blog_user_id = _user_id
    $$;

CREATE OR REPLACE FUNCTION get_latest_ten_blog_posts(IN _blog_id BIGINT, IN _user_id BIGINT)
    RETURNS TABLE (blog_post_id BIGINT, blog_user_id BIGINT, blog_id BIGINT, blog_post_title TEXT,
        blog_post_header TEXT, blog_post_content TEXT, blog_post_published TIMESTAMPTZ, blog_post_updated TIMESTAMPTZ,
        blog_post_url_slug TEXT)
    LANGUAGE SQL AS $$
        SELECT (blog_post.blog_post_id, blog_post.blog_user_id, blog_post.blog_id, blog_post.blog_post_title,
                blog_post.blog_post_header, blog_post.blog_post_content, blog_post.blog_post_published,
                blog_post.blog_post_updated, blog_post.blog_post_url_slug) FROM blog_post
        WHERE blog_post.blog_id = _blog_id AND blog_post.blog_user_id = _user_id ORDER BY blog_post_published
            DESC LIMIT 10;
    $$;

CREATE OR REPLACE FUNCTION get_salt_password_by_username(IN _username TEXT, OUT salted_password TEXT) RETURNS TEXT
    LANGUAGE SQL AS $$
        SELECT blog_user_password AS salted_password FROM blog_user WHERE blog_user_username = _username
    $$;

CREATE OR REPLACE FUNCTION get_salt_password_by_user_id(IN _user_id BIGINT, OUT salted_password TEXT) RETURNS TEXT
    LANGUAGE SQL AS $$
        SELECT blog_user_password AS salted_password FROM blog_user WHERE blog_user_id = _user_id
    $$;

CREATE OR REPLACE FUNCTION get_user_id_by_username(IN _username TEXT, OUT user_id BIGINT) RETURNS BIGINT
    LANGUAGE SQL AS $$
        SELECT blog_user_id AS user_id FROM blog_user WHERE blog_user_username = _username;
    $$;

CREATE OR REPLACE PROCEDURE update_blog(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _title TEXT, IN _header TEXT,
    IN _description TEXT, IN _url_slug TEXT, IN _meta_desc TEXT) LANGUAGE SQL AS $$
        UPDATE blog SET blog_title = _title, blog_description = _description, blog_header = _header,
                        blog_url_slug = _url_slug, blog_meta_description = _meta_desc WHERE blog_id = _blog_id AND
                        blog_user_id = _blog_user_id;
    $$;

CREATE OR REPLACE PROCEDURE delete_blog(IN _blog_id BIGINT, IN _blog_user_id BIGINT)
    LANGUAGE SQL AS $$
        DELETE FROM blog WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;
    $$;

CREATE OR REPLACE FUNCTION get_all_user_blogs(IN _blog_user_id BIGINT) RETURNS TABLE
    (blog_id BIGINT, blog_user_id BIGINT, blog_title TEXT, blog_header TEXT, blog_description TEXT,
    blog_created TIMESTAMPTZ, blog_url_slug TEXT)
    LANGUAGE SQL AS $$
        SELECT blog_id, blog_user_id, blog_title, blog_header, blog_description, blog_created, blog_url_slug FROM blog
        WHERE blog.blog_user_id = _blog_user_id;
    $$;

CREATE OR REPLACE FUNCTION get_blog_id_from_blog_title(IN _blog_title BIGINT, OUT blog_id BIGINT) RETURNS BIGINT
    LANGUAGE SQL AS $$
        SELECT blog.blog_id FROM blog WHERE blog_title = _blog_title;
    $$;

CREATE OR REPLACE FUNCTION get_blog_id_from_user_id(IN _user_id BIGINT) RETURNS TABLE
    (blog_id BIGINT, blog_title TEXT)
    LANGUAGE SQL AS $$
        SELECT blog_id, blog_title FROM blog WHERE blog_user_id = _user_id;
    $$;

CREATE OR REPLACE FUNCTION get_blog(IN _blog_id BIGINT, IN _blog_user_id BIGINT) RETURNS blog
    LANGUAGE SQL AS $$
        SELECT * FROM blog WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;
    $$;

CREATE OR REPLACE FUNCTION get_user_salt(IN _blog_username TEXT) RETURNS UUID
    LANGUAGE SQL AS $$
        SELECT blog_user_salt FROM blog_user WHERE blog_user_username = _blog_username;
    $$;

CREATE OR REPLACE PROCEDURE add_user_permissions(IN _blog_user_id BIGINT)
    LANGUAGE SQL AS $$
        INSERT INTO blog_user_permissions (blog_user_id) VALUES (_blog_user_id);
    $$;

CREATE OR REPLACE FUNCTION add_user_permissions() RETURNS TRIGGER AS $user_perms$
BEGIN
    INSERT INTO blog_user_permissions (blog_user_id) VALUES (NEW.blog_user_id);
    RETURN NULL;
END
$user_perms$ LANGUAGE plpgsql;

CREATE TRIGGER add_permissions
    AFTER INSERT ON blog_user
    FOR EACH ROW
EXECUTE FUNCTION add_user_permissions();

CREATE OR REPLACE PROCEDURE create_blog_page(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _blog_page_title TEXT,
    IN _blog_page_content TEXT, IN _blog_page_meta_description TEXT, IN _blog_header TEXT, IN _blog_url_slug TEXT)
    LANGUAGE SQL AS $$
        INSERT INTO blog_page (blog_id, blog_user_id, blog_page_title, blog_page_content, blog_page_meta_description,
                               blog_page_header, blog_page_url_slug)
        VALUES (_blog_id, _blog_user_id, _blog_page_title, _blog_page_content, _blog_page_meta_description,
                _blog_header, _blog_url_slug);
    $$;

CREATE OR REPLACE PROCEDURE delete_blog_page(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _blog_page_id BIGINT)
    LANGUAGE SQL AS $$
        DELETE FROM blog_page WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id AND
                                    blog_page_id = _blog_page_id;
    $$;

CREATE OR REPLACE PROCEDURE update_blog_page(IN _blog_user_id BIGINT, IN _blog_page_id BIGINT, IN _blog_page_title TEXT,
    IN _blog_page_content TEXT, IN _blog_page_meta_description TEXT, IN _blog_page_header TEXT,
    IN _blog_page_url_slug TEXT)
    LANGUAGE SQL AS $$
        UPDATE blog_page SET blog_page_title = _blog_page_title, blog_page_content = _blog_page_content,
        blog_page_meta_description = _blog_page_meta_description, blog_page_header = _blog_page_header,
                             blog_page_url_slug = _blog_page_url_slug WHERE blog_user_id = _blog_user_id
        AND blog_page_id = _blog_page_id;
    $$;

CREATE OR REPLACE FUNCTION get_blog_page(IN _blog_user_id BIGINT, IN _blog_page_id BIGINT) RETURNS blog_page
    LANGUAGE SQL AS $$
        SELECT * FROM blog_page WHERE blog_user_id = _blog_user_id AND blog_page_id = _blog_page_id;
    $$;

CREATE OR REPLACE FUNCTION get_all_user_blog_pages(IN __blog_user_id BIGINT) RETURNS TABLE
    (blog_page_id BIGINT, blog_id BIGINT, blog_user_id BIGINT, blog_page_title TEXT, blog_page_content TEXT,
    blog_page_meta_description TEXT, blog_page_header TEXT, blog_page_url_slug TEXT)
    LANGUAGE SQL AS $$
        SELECT * FROM blog_page WHERE blog_user_id = __blog_user_id;
    $$;

CREATE OR REPLACE FUNCTION get_all_blog_ids_from_user_id(IN _blog_user_id BIGINT) RETURNS TABLE
    (blog_id BIGINT, blog_title TEXT)
    LANGUAGE SQL AS $$
        SELECT blog_id, blog_title FROM blog WHERE blog_user_id = _blog_user_id;
    $$;

CREATE OR REPLACE PROCEDURE update_blog_page(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _blog_page_id BIGINT,
    IN _blog_page_title TEXT, IN _blog_page_content TEXT, IN _blog_page_meta_description TEXT,
    IN _blog_page_header TEXT, IN _blog_page_url_slug TEXT)
    LANGUAGE SQL AS $$
        UPDATE blog_page SET blog_page_title = _blog_page_title, blog_page_content = _blog_page_content,
        blog_page_meta_description = _blog_page_meta_description, blog_page_header = _blog_page_header,
                             blog_page_url_slug = _blog_page_url_slug WHERE blog_id = _blog_id AND
        blog_user_id = _blog_user_id AND blog_page_id = _blog_page_id;
    $$;

CREATE OR REPLACE FUNCTION get_page_and_blog_detail(IN _blog_user_id BIGINT) RETURNS TABLE
    (blog_page_id BIGINT, blog_page_title TEXT, blog_id BIGINT, blog_title TEXT)
    LANGUAGE SQL AS $$
        SELECT blog_page_id, blog_page_title, blog_page.blog_id, blog_title FROM blog_page
            INNER JOIN blog b on b.blog_id = blog_page.blog_id WHERE blog_page.blog_user_id = _blog_user_id
                                                                 AND b.blog_user_id = _blog_user_id;
    $$;

CREATE OR REPLACE PROCEDURE create_blog_post(IN _blog_user_id BIGINT, IN _blog_id BIGINT, IN _blog_post_title TEXT,
    IN _blog_post_content TEXT, IN _blog_post_meta_description TEXT, IN _blog_post_free_content TEXT,
    IN _blog_post_header TEXT, IN _blog_post_url_slug TEXT)
    LANGUAGE SQL AS $$
        INSERT INTO blog_post (blog_user_id, blog_id, blog_post_title, blog_post_content, blog_post_published,
                           blog_post_updated, blog_post_meta_description, blog_post_free_content, blog_post_header,
                           blog_post_url_slug) VALUES
        (_blog_user_id, _blog_id, _blog_post_title, _blog_post_content, current_timestamp, current_timestamp,
        _blog_post_meta_description, _blog_post_free_content, _blog_post_header, _blog_post_url_slug);
    $$;

CREATE OR REPLACE PROCEDURE update_blog_post(IN _blog_user_id BIGINT, _blog_post_id BIGINT, IN _blog_post_title TEXT,
    IN _blog_post_content TEXT, IN _blog_post_meta_description TEXT, IN _blog_post_free_content TEXT,
    IN _blog_post_header TEXT, IN _blog_post_url_slug TEXT)
    LANGUAGE SQL AS $$
        UPDATE blog_post SET blog_post_title = _blog_post_title, blog_post_content = _blog_post_content,
        blog_post_meta_description = _blog_post_meta_description, blog_post_free_content = _blog_post_free_content,
        blog_post_updated = current_timestamp, blog_post_header = _blog_post_header,
        blog_post_url_slug = _blog_post_url_slug WHERE blog_user_id = _blog_user_id AND blog_post_id = _blog_post_id;
    $$;

CREATE OR REPLACE PROCEDURE delete_blog_post(IN _blog_user_id BIGINT, IN _blog_post_id BIGINT)
    LANGUAGE SQL AS $$
        DELETE FROM blog_post WHERE blog_user_id = _blog_user_id AND blog_post_id = _blog_post_id;
    $$;

CREATE OR REPLACE FUNCTION get_blog_post(IN _blog_user_id BIGINT, IN _blog_post_id BIGINT) RETURNS blog_post
    LANGUAGE SQL AS $$
        SELECT * FROM blog_post WHERE blog_user_id = _blog_user_id AND blog_post_id = _blog_post_id;
    $$;

CREATE OR REPLACE FUNCTION get_all_user_blog_posts(IN _blog_user_id BIGINT, IN _blog_id BIGINT) RETURNS TABLE
    (blog_post_id BIGINT, blog_post_title TEXT, blog_post_content TEXT, blog_post_published TIMESTAMPTZ,
    blog_post_updated TIMESTAMPTZ, blog_post_meta_description TEXT, blog_post_free_content TEXT, blog_post_header TEXT,
    blog_post_url_slug TEXT)
    LANGUAGE SQL AS $$
        SELECT * FROM blog_post WHERE blog_user_id = _blog_user_id AND blog_id = _blog_id;
    $$;

CREATE OR REPLACE FUNCTION get_post_and_blog_detail(IN _blog_user_id BIGINT) RETURNS TABLE
    (blog_id BIGINT, blog_title TEXT, blog_post_id BIGINT, blog_post_title TEXT)
    LANGUAGE SQL AS $$
        SELECT b.blog_id, b.blog_title, blog_post.blog_post_id, blog_post.blog_post_title FROM blog_post
            INNER JOIN blog b ON b.blog_id = blog_post.blog_id WHERE blog_post.blog_user_id = _blog_user_id;
    $$;

CREATE OR REPLACE FUNCTION get_comments_for_post(IN _blog_post_id BIGINT) RETURNS TABLE
    (blog_post_comment_id BIGINT, blog_user_id BIGINT, blog_post_id BIGINT, blog_post_comment_title TEXT,
    blog_post_comment_content TEXT, blog_post_comment_date_posted TIMESTAMPTZ, blog_post_comment_updated TIMESTAMPTZ,
    blog_post_comment_reply_to BIGINT)
    LANGUAGE SQL AS $$
        SELECT * FROM blog_post_comment WHERE blog_post_comment.blog_post_id = _blog_post_id;
    $$;

CREATE OR REPLACE PROCEDURE create_comment(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _blog_post_id BIGINT,
    IN _blog_post_comment_content TEXT, IN _blog_post_comment_reply_to BIGINT,
    IN _blog_post_comment_title TEXT)
    LANGUAGE SQL AS $$
        INSERT INTO blog_post_comment (blog_id, blog_user_id, blog_post_id, blog_post_comment_title,
            blog_post_comment_content, blog_post_comment_reply_to,
            blog_post_comment_date_posted, blog_post_comment_date_updated) VALUES (_blog_id, _blog_user_id,
            _blog_post_id, _blog_post_comment_title, _blog_post_comment_content,
            _blog_post_comment_reply_to, current_timestamp, current_timestamp);
    $$;

CREATE OR REPLACE PROCEDURE update_comment(IN _blog_user_id BIGINT, IN _blog_post_comment_id BIGINT,
    IN _blog_post_comment_content TEXT, IN _blog_post_comment_title TEXT)
    LANGUAGE SQL AS $$
        UPDATE blog_post_comment SET blog_post_comment_content = _blog_post_comment_content,
        blog_post_comment_date_updated = current_timestamp, blog_post_comment_title = _blog_post_comment_title WHERE
        blog_user_id = _blog_user_id AND blog_post_comment_id = _blog_post_comment_id;
    $$;

CREATE OR REPLACE PROCEDURE delete_comment(IN _blog_user_id BIGINT, IN _blog_post_comment_id BIGINT)
    LANGUAGE SQL AS $$
        DELETE FROM blog_post_comment WHERE blog_user_id = _blog_user_id AND
        blog_post_comment_id = _blog_post_comment_id;
    $$;

CREATE OR REPLACE FUNCTION get_comments_on_blog_post(IN _blog_id BIGINT, IN _blog_user_id BIGINT, _blog_post_id BIGINT)
    RETURNS TABLE
    (blog_id BIGINT, blog_title TEXT, blog_post_id BIGINT, blog_post_title TEXT, blog_post_comment_id BIGINT,
    blog_post_comment_title TEXT)
    LANGUAGE SQL AS $$
        SELECT b.blog_id, b.blog_title, bp.blog_post_id, bp.blog_post_title, bpc.blog_post_comment_id,
        bpc.blog_post_comment_title FROM blog_post_comment JOIN blog_post bp ON bp.blog_id = blog_post_comment.blog_id
        JOIN blog_post_comment bpc ON bpc.blog_post_id = bp.blog_post_id JOIN blog b ON b.blog_id = bp.blog_id WHERE
        bpc.blog_post_id = _blog_post_id AND bp.blog_user_id = _blog_user_id AND b.blog_id = _blog_id;
    $$;

CREATE OR REPLACE FUNCTION get_latest_blog_posts() RETURNS TABLE
    (blog_id BIGINT, blog_post_id BIGINT, blog_post_header TEXT, blog_post_free_content TEXT,
    blog_post_published TIMESTAMPTZ)
    LANGUAGE SQL AS $$
        SELECT blog_id, blog_post_id, blog_post_header, blog_post_free_content, blog_post_published FROM blog_post
        ORDER BY blog_post_published DESC LIMIT 100;
    $$;

CREATE OR REPLACE FUNCTION get_email_verification_code_from_email(IN _email TEXT) RETURNS UUID
    LANGUAGE SQL AS $$
        SELECT blog_user_email_verification_code FROM blog_user WHERE blog_user_email = _email AND
        blog_user_email_verified = FALSE;
    $$;

CREATE OR REPLACE PROCEDURE verify_email_address(IN _email TEXT, IN _verification_code UUID)
    LANGUAGE SQL AS $$
        UPDATE blog_user SET blog_user_email_verified = TRUE WHERE blog_user_email = _email AND
        blog_user_email_verification_code = _verification_code;
    $$;

CREATE OR REPLACE FUNCTION get_email_from_verification_code(IN _verification_code UUID) RETURNS TEXT
    LANGUAGE SQL AS $$
        SELECT blog_user_email FROM blog_user WHERE blog_user_email_verification_code = _verification_code;
    $$;