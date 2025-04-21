export enum HttpStatusCode {
    NetworkError = 0,
    Ok = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    /** for input validation issues (and other errors caused by client) */
    BadRequest = 400, // java BadRequestException
    /** for authentication issues */
    Unauthorized = 401, // java NotAuthorizedException
    /** if a feature is not available on your pricing plan */
    PaymentRequired = 402, // java PaymentRequiredException
    /** for access control issues */
    Forbidden = 403, // java ForbiddenException
    NotFound = 404, // java NotFoundException
    MethodNotAllowed = 405, // java NotAllowedException
    NotAcceptable = 406, // java NotAcceptableException
    /** for concurrent editing issues like creation or concurrent modification of entities with the same key */
    Conflict = 409, // java ConflictException
    UnsupportedMediaType = 415, // java NotSupportedException
    ExpectationFailed = 417,
    TooManyRequests = 429, // java TooManyRequestsException
    InternalServerError = 500, // java InternalServerErrorException
    ServiceUnavailable = 503, // java ServiceUnavailableException
  }