# Soulike Website

Domain glossary for Soulike's personal website, covering blog publishing, site configuration, and administrator authentication.

## Language

### Authentication & Identity

**Account**:
A persisted administrator identity used to access and manage the site.
_Avoid_: User, Account Info

**Login Credentials**:
An unauthenticated username and password submitted to start an administrator session.
_Avoid_: User

**Session**:
An authenticated administrator login state that authorizes access to management operations.
_Avoid_: UserInfo

### Blog Publishing & Configuration

**Article**:
A persisted blog post together with its system-assigned identity, timestamps, page-view count, and visibility state.

**Article Draft**:
Author-supplied post content (title, category, body, and visibility) prepared for creating or editing an Article.
_Avoid_: NewArticle

**Article Abstract**:
A shortened preview projection of an Article shown in blog index and category listings.
_Avoid_: Article Summary

**Visibility**:
Whether an Article is exposed to public blog readers or hidden from public views.
_Avoid_: Public, Is Public

**Category**:
A named classification to which each Article belongs; a Category cannot be removed while any Article references it.

**Category Draft**:
Author-supplied category name prepared for creating or renaming a Category.

**Site Option**:
Site-wide editorial configuration content, currently the public About page content.
_Avoid_: About Option
