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

CREATE OR REPLACE FUNCTION add_user_permissions () RETURNS TRIGGER AS $user_perms$
BEGIN
    INSERT INTO blog_user_permissions (blog_user_id) VALUES (NEW.blog_user_id);
    RETURN NULL;
END
$user_perms$ LANGUAGE plpgsql;

CREATE TRIGGER add_permissions
    AFTER INSERT ON blog_user
    FOR EACH ROW
EXECUTE FUNCTION add_user_permissions ();