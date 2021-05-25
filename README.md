# CRUD User API

This project creates a CRUD Api for users using AWS

## Prerequisites

1. NPM >= 6.14.8
1. Node >= 14.15.0
1. aws-cli >= 1.18.218
1. Docker compose >= 1.29.2

## Run Locally with docker

For local development, I used [localstack](https://github.com/localstack/localstack). Each lambda
has an `index.js` and an `indexLocal.js`. The former is deployed to AWS while the latter is deployed to
localStack for local development. Follow the steps to run the API locally.

Clone the project

```bash
  git clone git@github.com:ioannisGiak89/aws-user-api.git
```

Go to the project directory

```bash
  cd aws-user-api
```

Install dependencies

```bash
  npm install
```

Start localStack container

```bash
  docker-compose up
```

Wait for localStack to be ready and then run the set up script

```bash
  npm run setup
```

Get the rest api id

```bash
  aws --endpoint-url=http://localhost:4566 apigateway get-rest-apis
```

The base url for the api is

```bash
  http://localhost:4566/restapis/{{apiId}}/local/_user_request_
```

Where {{apiId}} is the id that you found above

You can find a postman collection [here](https://www.getpostman.com/collections/79871e69d256bc23c481)

Set up the {{baseUrl}} as environment variable and start using the API

## Running Tests

To run unit tests, run the following command

```bash
  npm run test
```

To run integration tests, make sure localStack is running then run the following command

```bash
  npm run test:integration
```

## Demo

Import the postman collection. The link can be found above(see Run Locally with docker).

Then set up the {{baseUrl}} var to https://4qc04j0d4b.execute-api.eu-west-1.amazonaws.com/prod

## JSON Schema

The project is using [JSON schema](https://json-schema.org/) for data validation

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$ref": "#/definitions/User",
    "definitions": {
        "User": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "id": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "givenName": {
                    "type": "string"
                },
                "familyName": {
                    "type": "string"
                },
                "created": {
                    "type": "string"
                }
            },
            "required": ["email", "familyName", "givenName"],
            "title": "User"
        }
    }
}
```

## API Reference

#### Get all items

```http
  GET /users
```

#### Upsert user

```http
  PUT /users
```

| Parameter    | Type     | Description                                                                 |
| :----------- | :------- | :-------------------------------------------------------------------------- |
| `id`         | `string` | Id of the user. Must be unique. If it is not provided an id will be created |
| `email`      | `string` | **Required**. Email of the user                                             |
| `givenName`  | `string` | **Required**. Name of the user                                              |
| `familyName` | `string` | **Required**. Family name                                                   |
| `created`    | `string` | Date that the user is created. A new date is created if it is not provided  |

If `created` date and `id` are not provided the app will populate these values.

#### Delete user

```http
  DELETE /users/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of user to delete |
