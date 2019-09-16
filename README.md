# sso.gruppe-adler.de

This is the sso (Single Sign-on) service of Gruppe Adler. It enables central group / user management. Although you can't manage the permissions of these groups and users directly, other services like our blog, can use this service to authenticate users as a specific user or member of a specific group. Login works directly via steam.

## Setup
A docker image is available on [Docker Hub](https://hub.docker.com/r/gruppeadler/sso).  
- The container obviously should be reachable via Port 80/443.  
- There are two volumes:
    - `/usr/src/app/data`: Holds the database `database.sqlite` as well as an directory containing all avatars
    - `/usr/src/app/config`: Holds `config.json` as well as the keys for signing / decrypting the JWTs

## Configuration
Configuration can be done within the [config volume](#Setup). After configuration the config directory should look like this:
```
├── config.json
└── keys 
      ├── private.key
      └── public.key
```

### `config.json`
Here is a template `config.json` (you have to remove the comments of course)
```jsonc
{
    "jwt": {
        "issuer": "sso.gruppe-adler.de", // issuer field of jwt
        "audience": "sso.gruppe-adler.de", // audience field of jwt
        "expiresIn": "356d" // expiration (see https://www.npmjs.com/package/jsonwebtoken#usage)
    },
    "cookie": {
        "name": "gruppe-adler-sso-token", // name of cookie
        "domain": ".gruppe-adler.de" // domain of cookie
    },
    "steam": {
        "realm": "https://sso.gruppe-adler.de", // open id realm 
        "returnUrl": "https://sso.gruppe-adler.de/openid/return/steam", // return url after successful open id login
        "apiKey": "INSERT API KEY" // steam api-key to access steam user info
    }
}
```

### `keys`-Directory

The keys directory holds keys (`private.key` and `public.key`) to both sign and validate the JWTs. Those two keys just have to be a private and public RSA key pair. There are many different ways to create such keys, with one of the most easiest probably being this tool: http://travistidwell.com/jsencrypt/demo/

The keys have to each start with `-----BEGIN RSA PRIVATE KEY-----` / `-----BEGIN RSA PUBLIC KEY-----` and have to end with `-----END RSA PRIVATE KEY-----` / `-----END RSA PUBLIC KEY-----`.

## v1 API

### GraphQL API
There is a graphql api available at the endpoint [`/api/v1/graphql`](https://sso.gruppe-adler.de/api/v1/graphql).
Just use the [GraphiQL web interface](https://sso.gruppe-adler.de/api/v1/graphql) located in the same endpoint for further reference.
Some queries/mutations require [proper authentication](#authentication) and access rights (being admin / only working for own user).

### PUT `/api/v1/upload/avatar/:id`
This endpoint is used to upload new avatars.
- The request works only with [proper authentication](#authentication) (as admin or the user, which is being updated)
- The `:id` param has to be the id the of the user for which to update the avatar.  
- The request body has to be for data with the `avatar` field containing the file.
- The maximum allowed file size is 1MB.  

### Authentication
You can authenticate yourself by either setting the `Authorization` HTTP Header to `Bearer <YOUR_JWT_TOKEN_HERE>` or sending a cookie - containing the JWT - with the configured name (see [`config.json`](#config.json)) alongside your request.
A JWT can be obtained with the `login` mutation.

## Avatars
Avatars are available at `/avatars/<AVATAR_FILE_NAME>`. So if the avatar for the user is `meh.jpg` the file is served at [`https://sso.gruppe-adler.de/avatars/meh.jpg`](https://sso.gruppe-adler.de/avatars/lg77opahotl4g7n63kydh.gif)

## Cookie
When the user authenticates against the SSO service, the SSO replies with a cookie, which holds the JWT token. The name and the domain of the cookie can be configured in your [`config.json`](#config.json). The cookie is configured to work HTTPS only.
