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

ALTER TABLE blog ADD COLUMN blog_meta_description TEXT NOT NULL DEFAULT 'BLANK';

ALTER TABLE blog_post ADD COLUMN blog_post_meta_description TEXT NOT NULL DEFAULT 'BLANK';
ALTER TABLE blog_post DROP CONSTRAINT blog_post_cost_to_view;
ALTER TABLE blog_post DROP COLUMN blog_post_cost;
ALTER TABLE blog_post DROP CONSTRAINT num_blog_post_views;
ALTER TABLE blog_post DROP COLUMN blog_post_views;

ALTER TABLE blog_user_permissions ADD COLUMN blog_user_permissions_can_upload_video BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE blog_user_permissions ADD COLUMN blog_user_permissions_can_upload_sound BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE blog_user_permissions ADD COLUMN blog_user_permissions_is_moderator BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE blog_page ADD COLUMN blog_page_meta_description TEXT NOT NULL DEFAULT 'BLANK';

ALTER TABLE blog_post_comment DROP CONSTRAINT blog_post_comment_cost_to_post;
ALTER TABLE blog_post_comment DROP COLUMN blog_post_comment_cost;

DROP TABLE blog_post_comment_cost_history;
DROP TABLE blog_post_cost_history;