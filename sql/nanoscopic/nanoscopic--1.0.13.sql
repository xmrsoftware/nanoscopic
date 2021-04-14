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

DROP PROCEDURE create_blog(_user_id bigint, _name text, _description text);

CREATE OR REPLACE PROCEDURE create_blog(IN _user_id BIGINT, IN _name TEXT, IN _description TEXT, IN _meta_desc TEXT)
    LANGUAGE SQL AS $$
    INSERT INTO blog (blog_user_id, blog_name, blog_description, blog_meta_description, blog_created)
    VALUES (_user_id, _name, _description, _meta_desc, current_timestamp);
    $$;

DROP FUNCTION get_all_user_blogs(_blog_user_id bigint);

CREATE OR REPLACE FUNCTION get_all_user_blogs(IN _blog_user_id BIGINT) RETURNS TABLE
    (_blog_id BIGINT, _blog_name TEXT, _blog_description TEXT, _blog_meta_description TEXT)
    LANGUAGE SQL AS $$
    SELECT blog_id, blog_name, blog_description, blog_meta_description FROM blog WHERE blog_user_id = _blog_user_id;
    $$;

DROP FUNCTION get_blog(_blog_id BIGINT, _blog_user_id BIGINT);

CREATE OR REPLACE FUNCTION get_blog(IN _blog_id BIGINT, IN _blog_user_id BIGINT) RETURNS TABLE
    (blog_id BIGINT, blog_user_id BIGINT, blog_name TEXT, blog_description TEXT, blog_meta_description TEXT)
    LANGUAGE SQL AS $$
    SELECT blog_id, blog_user_id, blog_name, blog_description, blog_meta_description FROM blog
    WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;
    $$;

DROP PROCEDURE  update_blog(_blog_id BIGINT, _blog_user_id BIGINT, _name TEXT, _description TEXT);

CREATE OR REPLACE PROCEDURE update_blog(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _name TEXT,
    IN _description TEXT, IN _meta_desc TEXT)
    LANGUAGE SQL AS $$
    UPDATE blog SET blog_name = _name, blog_description = _description, blog_meta_description = _meta_desc
    WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;
    $$;

DROP FUNCTION get_latest_ten_blog_posts(_blog_id bigint);

ALTER TABLE blog_post ADD COLUMN blog_post_free_content TEXT NOT NULL DEFAULT 'BLANK';