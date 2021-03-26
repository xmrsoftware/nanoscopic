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

CREATE OR REPLACE PROCEDURE update_blog (IN _blog_id BIGINT, IN _blog_user_id BIGINT, IN _name TEXT, IN _description TEXT)
    AS
    'UPDATE blog SET blog_name = _name, blog_description = _description WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;'
    LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE delete_blog (IN _blog_id BIGINT, IN _blog_user_id BIGINT)
    AS
    'DELETE FROM blog WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;'
    LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_all_user_blogs (IN _blog_user_id BIGINT) RETURNS TABLE
    (_blog_id BIGINT, _blog_name TEXT, _blog_description TEXT) AS
    'SELECT blog_id, blog_name, blog_description FROM blog WHERE blog_user_id = _blog_user_id;'
    LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_blog_id_from_blog_name (IN _blog_name TEXT, OUT _blog_id BIGINT) RETURNS BIGINT AS
    'SELECT blog_id AS _blog_id FROM blog WHERE blog_name = _blog_name;'
    LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_blog (IN _blog_id BIGINT, IN _blog_user_id BIGINT) RETURNS RECORD AS
    'SELECT FROM blog WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;'
    LANGUAGE SQL;