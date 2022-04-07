import { prepareRequest } from '../shared'
import { IBridgeAppFunction, AppExecutionContext, ICredentialCreationResponse } from '@doflo/flow-interfaces'

export class helperMethods {
    async createCredential(
        this: IBridgeAppFunction,
        context: AppExecutionContext<{
            code: string;
            shop: string;
            state: string;
            timestamp: string;
            hmac: string;
            host: string;
        }>
    ): Promise<ICredentialCreationResponse> {

        // Examples
        //const url = `https://${context.data.shop}/admin/oauth/access_token`;

        //const url = `https://${context.data.shop}/admin/oauth/access_token?mode=${this.env.ENV.toLowerCase()}`;

        const url = this.utilities.strings.evalAsTemplate(this.env['ACCESS_TOKEN_URL'])

        try {
            const form = new URLSearchParams();

            form.append("client_id", this.env.APP_TOKEN);
            form.append("client_secret", this.env.APP_SECRET);
            form.append("code", context.data.code);

            var resp = await this.fetch(url, {
                method: "POST",
                body: form,
            });

            if (resp.status >= 200 && resp.status <= 300) {

                var json = await resp.json();

                json["shop"] = context.data.shop

                var receipt = await this.stash(json);

                return {
                    data: {
                        id: receipt.key,
                        state: context.data.state,
                        FERN: "example:credential:appCredential",
                    },
                };
            }
        } catch (ex) {
            this.log.error(ex);
        }
        throw new Error("external credential creation failed");
    }
}