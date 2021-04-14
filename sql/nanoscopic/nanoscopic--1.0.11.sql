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

DROP FUNCTION get_blog(_blog_id BIGINT, _blog_user_id BIGINT);

CREATE OR REPLACE FUNCTION get_blog(IN _blog_id BIGINT, IN _blog_user_id BIGINT) RETURNS TABLE
    (blog_id BIGINT, blog_user_id BIGINT, blog_name TEXT, blog_description TEXT) AS
    'SELECT blog_id, blog_user_id, blog_name, blog_description FROM blog WHERE blog_id = _blog_id AND blog_user_id = _blog_user_id;'
    LANGUAGE SQL;