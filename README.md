# sso.gruppe-adler.de

This is the sso (Single Sign-on) service of Gruppe Adler. It enables central group / user management. Although you can't manage permissions of these groups directly other services, like our blog, can use this service to authenticate users. Login works directly via steam.

## Setup
A docker image is available on [Docker Hub](https://hub.docker.com/r/gruppeadler/sso).  
- The container obviously should be reachable via Port 80/443.  
- There are two volumes:
    - `/usr/src/app/data`: Holds the database `database.sqlite` as well as a directory containing all avatars
    - `/usr/src/app/config`: Holds `config.json` as well as the keys for signing / decrypting the JWTs

## Configuration
Configuration can be done within the [config volume](#Setup). After configuration the config directory should look like this:
```
/etc/docker-configs
├── config.json Hier befindet sich alles zur Homepage
└── keys 
      ├── private.key
      └── public.key
```

### `config.json`
Here is a template `config.json`
```jsonc
{
    "jwt": { // everything that has to do with JWTs
        "issuer": "sso.gruppe-adler.de", // issuer field of jwt
        "audience": "sso.gruppe-adler.de", // audience field of jwt
        "expiresIn": "356d" // expiration (see https://www.npmjs.com/package/jsonwebtoken#usage)
    },
    "cookie": { // cookie configuration
        "name": "gruppe-adler-sso-token", // name of cookie
        "domain": ".gruppe-adler.de" // domain of cookie
    },
    "steam": { // steam open id configuration
        "realm": "https://sso.gruppe-adler.de", // open id realm 
        "returnUrl": "https://sso.gruppe-adler.de/openid/return/steam", // return url after successful open id login
        "apiKey": "INSERT API KEY" // steam api-key to access steam user info
    }
}
```

### `keys`-Directory

The keys directory holds keys (`private.key` and `public.key`) to both sign and decode the jwt keys. Those two keys just have to be a private and public RSA key pair. There are many different ways to create such keys, with one of the most easiest probably being this tool: http://travistidwell.com/jsencrypt/demo/

## v1 API

### `/api/v1/graphql`
There is a graphql api available with the endpoint being [`/api/v1/graphql`](https://sso.gruppe-adler.de/api/v1/graphql).
Just use the [GraphiQL web interface](https://sso.gruppe-adler.de/api/v1/graphql) located in the same endpoint for further reference.

### `/upload/avatar/:id`
This endpoint is used to upload new avatars. The maximum allowed file size is 1MB. For "documentation" just see [this part of the code](https://github.com/gruppe-adler/sso.gruppe-adler.de/blob/cf1ddd39796868cdd9da5046976b1cdd11cd9a34/frontend/src/services/index.ts#L227-L240).

## Avatars

Avatars are available at `/avatars/<AVATAR_FILE_NAME>`. So if the avatar for the user is `lg77opahotl4g7n63kydh.gif` the file is served at [`https://sso.gruppe-adler.de/avatars/lg77opahotl4g7n63kydh.gif`](https://sso.gruppe-adler.de/avatars/lg77opahotl4g7n63kydh.gif)

## Cookie
When the user authenticates against the SSO service, the SSO replies with a cookie, which holds the JWT token. 

## Standard Authentication workflow for third parties
tba