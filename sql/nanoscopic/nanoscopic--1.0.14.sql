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

CREATE OR REPLACE PROCEDURE create_blog_page(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _blog_page_title TEXT,
    IN _blog_page_content TEXT, IN _blog_page_meta_description TEXT) LANGUAGE SQL AS $$
    INSERT INTO blog_page (blog_id, blog_user_id, blog_page_title, blog_page_content, blog_page_meta_description)
    VALUES (_blog_id, _blog_user_id, _blog_page_title, _blog_page_content, _blog_page_meta_description);
    $$;

CREATE OR REPLACE PROCEDURE delete_blog_page(IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _blog_page_id BIGINT)
    LANGUAGE SQL AS $$
    DELETE FROM blog_page WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id AND blog_page_id = _blog_page_id;
    $$;

CREATE OR REPLACE PROCEDURE update_blog_page(IN _blog_user_id BIGINT, IN _blog_page_id BIGINT, IN _blog_page_title TEXT,
    IN _blog_page_content TEXT, IN _blog_page_meta_description TEXT) LANGUAGE SQL AS $$
    UPDATE blog_page SET blog_page_title = _blog_page_title, blog_page_content = _blog_page_content,
    blog_page_meta_description = _blog_page_meta_description WHERE blog_user_id = _blog_user_id
    AND blog_page_id = _blog_page_id;
    $$;

CREATE OR REPLACE FUNCTION get_blog_page(IN _blog_user_id BIGINT, IN _blog_page_id BIGINT) RETURNS TABLE
    (_blog_page_title TEXT, _blog_page_content TEXT, _blog_page_meta_description TEXT) LANGUAGE SQL AS $$
    SELECT blog_page_title, blog_page_content, blog_page_meta_description FROM blog_page WHERE
    blog_user_id = _blog_user_id AND blog_page_id = _blog_page_id;
    $$;