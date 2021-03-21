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

CREATE OR REPLACE FUNCTION get_salt_password_by_username (IN username TEXT, OUT salted_password TEXT) RETURNS TEXT AS $$
        SELECT blog_user_password AS salted_password FROM blog_user WHERE blog_user_username = username
    $$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_salt_password_user_id (IN user_id BIGINT, OUT salted_password TEXT) RETURNS TEXT AS $$
        SELECT blog_user_password AS salted_password FROM blog_user WHERE blog_user_id = user_id
    $$ LANGUAGE SQL;