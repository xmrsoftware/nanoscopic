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

CREATE TABLE blog_page (
    blog_page_id BIGSERIAL PRIMARY KEY,
    blog_id BIGINT NOT NULL REFERENCES blog(blog_id),
    blog_user_id BIGINT NOT NULL REFERENCES blog_user(blog_user_id),
    blog_page_title TEXT NOT NULL,
    blog_page_content TEXT NOT NULL
);