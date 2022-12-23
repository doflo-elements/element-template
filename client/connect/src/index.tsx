import React, { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { ICredentialCreationResponse, ui } from "@doflo/flow-interfaces";


interface IOAuthData {
  code: string;
  shop: string;
  state: string;
  timestamp: string;
  hmac: string;
  host: string;
}

export const credentialHelper = (
  props: ui.IComponentProps<{
    APP_TOKEN: string;
    AUTH_SERVER: string;
    CLIENT_ID: string;
    NAMESPACE: string;
  }>
) => {
  const [storeName, setStoreName] = useState<string>();
  const [code, setCode] = useState("");
  const [shop, setShop] = useState("");
  const [state, setState] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [hmac, setHmac] = useState("");
  const [host, setHost] = useState("");
  const [ok, setOk] = useState(false);
  const [good, setGood] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (props.api.page.search) {
      let param = props.api.page.search;
      if (param.get("code")) {
        setCode(param.get("code")!);
        setHost(param.get("host")!);
        setHmac(param.get("hmac")!);
        setState(param.get("state")!);
        setTimestamp(param.get("timestamp")!);
        setShop(param.get("shop")!);
      }
    }
  }, [window && window.location.search]);

  useEffect(() => {
    if (code && code.length > 0) {
      setCreating(true);
      try {
        props.api.action
          .execute<ICredentialCreationResponse, IOAuthData>({
            actionName: "createCredential",
            namespace: props.env.NAMESPACE,
            data: {
              code: code,
              shop: shop,
              state: state,
              timestamp: timestamp,
              hmac: hmac,
              host: host,
            },
          })
          .then((resp) => {
            props.api.credential.finalizeCredential(resp, state);
            setGood(true);
          })
          .catch((e) => {
            setError(e.toString());
          });
      } catch (ex) {
        setError(ex.toString());
      }
    }
  }, [code]);

  // useEffect(() => {
  //   if (storeName.trim().length > 0) {
  //     if (storeName.trim().charAt(0) !== "-") {
  //       if (storeName.trim().charAt(storeName.trim().length - 1) !== "-") {
  //         setOk(true);
  //       } else {
  //         setOk(false);
  //       }
  //     } else {
  //       setOk(false);
  //     }
  //   } else {
  //     setOk(false);
  //   }
  // }, [storeName]);

  function sendToServer() {
    var clientId = props.env.APP_TOKEN;
    var scopes = [
      "write_orders",
      "read_orders",
      "write_themes",
      "write_products",
      "read_product_listings",
      "write_customers",
      "write_order_edits",
      "write_draft_orders",
      "write_inventory",
      "read_locations",
      "write_script_tags",
      "write_fulfillments",
      "write_assigned_fulfillment_orders",
      "write_merchant_managed_fulfillment_orders",
      "write_third_party_fulfillment_orders",
      "write_shipping",
      "write_checkouts",
      "write_reports",
      "write_price_rules",
      "write_discounts",
      "write_marketing_events",
      "write_resource_feedbacks",
      "read_shopify_payments_payouts",
      "read_shopify_payments_disputes",
    ].join(",");
    var url = (window as unknown as Window).location as unknown as string;

    props.api.page.redirect(
      `https://${storeName}.${
        props.env.AUTH_SERVER
      }.com/admin/oauth/authorize?client_id=${
        props.env.CLIENT_ID
      }&redirect_uri=${encodeURI(url)}&scope=${scopes}${
        props.api.page.state ? `&state=${props.api.page.state}` : ``
      }`
    );
  }

  return !good && !creating && !error ? (
    <>Redirecting ...</>
  ) : error ? (
    <Alert severity="warning">
      <AlertTitle>
        <b>Error Creating Credential</b>
      </AlertTitle>
      {error}
    </Alert>
  ) : creating ? (
    <>Creating Credential</>
  ) : (
    <>Credential Created</>
  );
};

export default credentialHelper;
