# BLOG

Préparer la base de donnée du module NODE-SQL et donc faire le MCD puis le MLD.

Ce sera un blog.

## Rôle des utilisateurs
Celui qui doit être authentifier :
- administrateur (un seul)

Celui qui navigue sur notre app':
- visiteur

### Privilèges
Un administrateur peut :
- tout faire 🙃

Le visiteur peut:
- lire les articles 
- commenter un article

## Données de base

### Utilisateur
- alias
- email
- password
- registration date
> possède un rôle (pour l'instant juste admin)

### Article
- title
- content
- date
> peut avoir plusieurs images
> peut appartenir à plusieurs catégories
> est lié à un author (ici pour l'instant juste l'admin')

### Commentaire
- user
- message
- date
> est lié à un article

-------------
### correction
> MCD
```
:
:
user: id, alias, email, pwd, regDate
have1, 11 user, 0N role
role: id, title

:
:
write, 11 story, 0N user: withAuthorRole
:


:

category: id, title
have3, 0N category, 1N story
story: id, title, content, date
have2, 1N story, 11 photo
photo: id, url

:

have4, 11 com, 0N story

:
com: id, user, msg, date
:
```
