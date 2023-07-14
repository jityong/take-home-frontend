interface ProvidersNameResp {
    data: [
        string
    ]
}
interface ProviderDetailsResp {
    apis:
        {
            [key: string]: ProviderDetail
        }
}

interface ProviderDetail {
    info: Info;
    swaggerUrl: string;
}

interface Info {
    description: string;
    title: string;
    contact: Contact;
    'x-logo': {
        url: string;
    }
}

interface Contact {
    email: string;
    name: string;
    url: string;
}