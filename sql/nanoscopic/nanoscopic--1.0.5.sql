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

CREATE OR REPLACE FUNCTION get_username_by_user_id (IN _user_id BIGINT, OUT username TEXT) RETURNS TEXT AS $$
        SELECT blog_user_username AS username FROM blog_user WHERE blog_user_id = _user_id
    $$ LANGUAGE SQL;

DROP FUNCTION get_username_by_userid (IN _user_id BIGINT, OUT username TEXT);