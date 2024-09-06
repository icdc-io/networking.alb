import { PropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Header,
  Icon,
  Input,
  Popup,
  Radio,
} from "semantic-ui-react";
import isFQDN from "validator/lib/isFQDN";
import {
  createWebRouteData,
  fetchCertificates,
  fetchGateways,
  fetchWebRoute,
  fetchWebRoutesService,
  updateWebRoute,
  updateWebRouteReset,
} from "../AppActions";
import { methodsOptions, optionsOfScheme } from "../constants/options";
import { detailsPath, webRoutesPath } from "../constants/routes";
import CancelChangesModal from "./CancelChangesModal";
import FormField from "./FormField";
import HeadersFormSection from "./HeadersFormSection";

const CreateEditForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();
  const userEmail = JSON.parse(localStorage.getItem("user")).email;
  const currentRoute = useSelector(
    (state) => state.BalancerStore.traefikRoute.route,
  );
  const traefikRouteServices = useSelector(
    (state) => state.BalancerStore.traefikRouteServices,
  );
  const currentRouteStatus = useSelector(
    (state) => state.BalancerStore.traefikRouteStatus,
  );
  const traefikRouteUpdateStatus = useSelector(
    (state) => state.BalancerStore.traefikRouteUpdateStatus,
  );
  const traefikGateways = useSelector(
    (state) => state.BalancerStore.traefikGateways,
  );
  const traefikGatewaysStatus = useSelector(
    (state) => state.BalancerStore.traefikGatewaysStatus,
  );
  const certificates = useSelector((state) => state.BalancerStore.certificates);
  const dispatch = useDispatch();

  const [isOpenCancelChangesModal, setIsOpenCancelChangesModal] =
    useState(false);
  const state = {
    /* eslint camelcase: 0 */
    name: "",
    hostname: "",
    path: "",
    target_port: "",
    tls_termination: "",
    insecure: "",
    certificate_id: "",
    owner: "",
    ip_version: "",
    cloud_gateway_id: "",
    source_proto: "tcp",
    destination_proto: "tcp",
    services: [],
    healthcheck_enabled: false,
    healthcheck: {
      path: "",
      scheme: "",
      hostname: "",
      port: "",
      interval: 30,
      timeout: 5,
      headers: {},
      method: methodsOptions[0].value,
      follow_redirects: true,
    },
  };
  const initialServices = [{ id: "" }];

  const [form, setForm] = useState(state);
  const [split, setSplit] = useState(false);
  const [secure, setSecure] = useState(false);
  const [listServices, setListServices] = useState(initialServices);
  const [ipv, setIpv] = useState(false);

  const tlsOptions = [
    { text: "edge", value: "edge" },
    { text: "passthrough", value: "passthrough" },
    { text: "re-encrypt", value: "re-encrypt" },
  ];
  const cloudGatewaysOptions = traefikGateways.map((el) => ({
    text: `${el.cloudgw_instance} (${el.account}) ${el.name}`,
    value: el.id,
  }));
  const insecureOptions = [
    { text: "allow", value: "allow" },
    { text: "redirect", value: "redirect" },
  ];
  const certificatesOptions = certificates.map((el) => ({
    text: el.name,
    value: el.id,
  }));
  const servicesOptions = traefikRouteServices.map((el) => ({
    text: `${el.name} (${el.ext_id})`,
    value: el.id,
    key: el.id,
  }));

  //field validations
  const portValidation =
    /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
  const weightValidation = /^(100|[1-9][0-9]?)$/;
  const targetPortErr = !!(
    !portValidation.test(form.target_port) && form.target_port !== ""
  );
  const weightErr = (weight) => !weightValidation.test(weight);

  useEffect(() => {
    setListServices(initialServices);
    id &&
      currentRouteStatus === "fulfilled" &&
      setForm({
        name: currentRoute.name,
        hostname: currentRoute.hostname,
        path: currentRoute.path,
        target_port: currentRoute.target_port,
        tls_termination: currentRoute.tls_termination,
        insecure: currentRoute.insecure,
        certificate_id: currentRoute.certificate_id,
        owner: currentRoute.owner,
        ip_version: currentRoute.ip_version,
        cloud_gateway_id: currentRoute.cloud_gateway_id,
        source_proto: currentRoute.source_proto,
        destination_proto: currentRoute.destination_proto,
        services: currentRoute.services,
        healthcheck_enabled: currentRoute.healthcheck_enabled,
        healthcheck: currentRoute.healthcheck_enabled
          ? {
              path: currentRoute?.healthcheck?.path,
              scheme: currentRoute?.healthcheck?.scheme,
              hostname: currentRoute?.healthcheck?.hostname
                ? currentRoute.healthcheck.hostname
                : "",
              port: currentRoute?.healthcheck?.port,
              interval: currentRoute?.healthcheck?.interval,
              timeout: currentRoute?.healthcheck?.timeout,
              headers: currentRoute?.healthcheck?.headers || {},
              method: currentRoute?.healthcheck?.method,
              follow_redirects: currentRoute?.healthcheck?.follow_redirects,
            }
          : state.healthcheck,
      });

    id &&
      currentRouteStatus === "fulfilled" &&
      currentRoute.routes_services.length > 0 &&
      setListServices(
        currentRoute.routes_services.map((el) => ({
          id: el.service_id,
          weight: el.value,
        })),
      );

    id &&
      currentRouteStatus === "fulfilled" &&
      currentRoute.routes_services.length === 1 &&
      setListServices(
        currentRoute.routes_services.map((el) => ({ id: el.service_id })),
      );

    id &&
      currentRouteStatus === "fulfilled" &&
      currentRoute.services.length === 0 &&
      setListServices(initialServices);

    id &&
      currentRouteStatus === "fulfilled" &&
      currentRoute.tls_termination &&
      setSecure(true);

    id &&
      currentRouteStatus === "fulfilled" &&
      currentRoute.services.length > 1 &&
      setSplit(true);

    id &&
      currentRouteStatus === "fulfilled" &&
      currentRoute.ip_version === "6" &&
      setIpv(true);

    dispatch(fetchWebRoutesService());
  }, [currentRoute, currentRouteStatus, id]);

  useEffect(() => {
    id && dispatch(fetchWebRoute(id));
    dispatch(updateWebRouteReset());
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchCertificates());
    dispatch(fetchGateways());
  }, []);

  useEffect(() => {
    !id &&
      traefikGatewaysStatus === "fulfilled" &&
      setForm({ ...form, cloud_gateway_id: cloudGatewaysOptions[0].value });
  }, [traefikGatewaysStatus, id]);

  useEffect(() => {
    !split &&
      setListServices(
        listServices.filter((el, i) => i === 0).map((el) => ({ id: el.id })),
      );
    split &&
      (id !== undefined
        ? currentRoute.routes_services.length === 1
        : listServices.length === 2) &&
      setListServices(
        [...listServices].map((el, i) => (i === 0 ? { ...el, weight: 1 } : el)),
      );
  }, [split, id]);

  useEffect(() => {
    !secure
      ? setForm({
          ...form,
          tls_termination: null,
          insecure: null,
          certificate_id: null,
        })
      : setForm({ ...form, tls_termination: tlsOptions[0].value });
  }, [secure]);

  useEffect(() => {
    listServices[1] === undefined && setSplit(false);
  }, [listServices]);

  const openCancelChangesModal = (isOpen = true) => {
    setIsOpenCancelChangesModal(isOpen);
  };

  //disabled buttons
  const disabledCreateBtn = () =>
    form.name === "" ||
    form.cloud_gateway_id === "" ||
    !isFQDN(form.hostname) ||
    targetPortErr ||
    (listServices.length > 1 &&
      listServices.some((el) => weightErr(el.weight))) ||
    (form.healthcheck_enabled &&
      form?.healthcheck?.hostname &&
      !isFQDN(form?.healthcheck?.hostname));

  const addService = () => {
    setListServices([...listServices, { id: "", weight: "1" }]);
    setSplit(true);
  };

  const deleteService = (index) => {
    listServices.length > 1
      ? setListServices(listServices.filter((e, i) => i !== index))
      : setListServices(initialServices);
  };

  const createRouteHandler = () => {
    dispatch(
      createWebRouteData({
        route: {
          ...form,
          path: form.path === "" ? "/" : form.path,
          owner: userEmail,
          target_port: form.target_port === "" ? "80" : form.target_port,
          services: listServices.filter((el) => el.id !== ""),
          ip_version: !ipv ? "4" : "6",
          tls_termination:
            form.tls_termination === "" ? null : form.tls_termination,
          insecure: form.insecure === "" ? null : form.insecure,
          certificate_id:
            form.certificate_id === "" ? null : form.certificate_id,
          healthcheck: {
            ...form.healthcheck,
            path: form.healthcheck.path === "" ? "/" : form.healthcheck.path,
          },
        },
      }),
    );
    setForm(state);
    setListServices(initialServices);
  };

  const changeRouteHandler = () => {
    dispatch(
      updateWebRoute(
        {
          route: {
            ...form,
            path: form.path === "" ? "/" : form.path,
            target_port: form.target_port === "" ? "80" : form.target_port,
            services: listServices.filter((el) => el.id !== ""),
            ip_version: !ipv ? "4" : "6",
            tls_termination:
              form.tls_termination === "" ? null : form.tls_termination,
            insecure: form.insecure === "" ? null : form.insecure,
            certificate_id:
              form.certificate_id === "" ? null : form.certificate_id,
            healthcheck: form?.healthcheck_enabled
              ? {
                  ...form.healthcheck,
                  path:
                    form.healthcheck.path === "" ? "/" : form.healthcheck.path,
                }
              : state.healthcheck,
          },
        },
        id,
      ),
    );
  };

  const altServices =
    listServices.length > 1 || split ? (
      listServices.map((s, index) => (
        <section className="addService flex" key={index}>
          <div className="firstField">
            <label>{t("service")}</label>
            <Dropdown
              search
              selection
              value={s.id}
              options={servicesOptions}
              placeholder="None"
              style={{ width: "98%" }}
              selectOnBlur={false}
              onChange={(e, data) =>
                setListServices(
                  listServices.map((el, i) =>
                    i === index ? { ...el, id: data.value } : { ...el },
                  ),
                )
              }
            />
            <span className="subTitleForm">{t("altService")}</span>
            <span className="altServiceControl">
              <p onClick={() => deleteService(index)}>{t("deleteService")}</p>|
              <p onClick={addService}>{t("anotherService")}</p>
            </span>
          </div>
          <div className="secondField">
            <label>{t("weight")}</label>
            <Form.Field error={weightErr(s.weight)}>
              <Input
                value={s.weight}
                type="text"
                style={{ width: "100%" }}
                onChange={(e, data) =>
                  setListServices(
                    listServices.map((el, i) =>
                      i === index ? { ...el, weight: data.value } : { ...el },
                    ),
                  )
                }
              />
            </Form.Field>
            <span className="subTitleForm">{t("weightDescript")}</span>
          </div>
        </section>
      ))
    ) : (
      <section className="addOneService">
        <div>
          <label>{t("service")}</label>
          <Dropdown
            search
            selection
            value={listServices[0]?.id}
            options={servicesOptions}
            placeholder="None"
            style={{ width: "100%" }}
            selectOnBlur={false}
            onChange={(e, data) =>
              setListServices(
                listServices.map((el) => ({ ...el, id: data.value })),
              )
            }
          />
          <span className="subTitleForm">{t("altService")}</span>
          <span className="altServiceControl">
            <p onClick={deleteService}>{t("deleteService")}</p>|
            <p onClick={addService}>{t("anotherService")}</p>
          </span>
        </div>
      </section>
    );

  if (traefikRouteUpdateStatus === "fulfilled") {
    return navigate(id ? detailsPath(id) : webRoutesPath());
  }

  return (
    <Form className="formContainer">
      <div className="routeBlock">
        <Header as="h4" style={{ marginBottom: "10px" }}>
          {t("general")}
        </Header>
        <FormField
          value={form.name}
          label={t("name")}
          placeholder="my-route"
          callback={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <span className="subTitleForm">{t("traefikUniqName")}</span>

        <FormField
          value={form.hostname}
          label={t("hostname")}
          placeholder="www.example.com"
          callback={(e) =>
            setForm({ ...form, hostname: e.currentTarget.value })
          }
          error={!(isFQDN(form.hostname) || form.hostname === "")}
        />
        <span className="subTitleForm">{t("traefikPublHostname")}</span>

        <FormField
          value={form.path}
          label={`${t("path")} ${t("optional")}`}
          placeholder="/"
          callback={(e) => setForm({ ...form, path: e.currentTarget.value })}
        />
        <span className="subTitleForm">{t("traefikPath")}</span>

        <FormField
          value={form.target_port}
          label={`${t("targetPort")} ${t("optional")}`}
          placeholder="443"
          callback={(e) =>
            setForm({ ...form, target_port: e.currentTarget.value })
          }
          error={targetPortErr}
        />
        <span className="subTitleForm">{t("traefikTargetPortDescript")}</span>

        <section className="balancer-block">
          <label>{t("balancer")}</label>
          <Dropdown
            selection
            clearable
            value={form.cloud_gateway_id}
            options={cloudGatewaysOptions}
            placeholder="None"
            selectOnBlur={false}
            onChange={(param, data) =>
              setForm({ ...form, cloud_gateway_id: data.value })
            }
          />
          <span className="subTitleForm">{t("balancerDescription")}</span>
        </section>
      </div>
      <div className="routeBlock">
        <Header as="h4" style={{ marginBottom: "10px" }}>
          {t("traefikTargetServices")}
        </Header>
        <span className="subTitleForm">{t("traefikSplitTrafficDescript")}</span>

        {altServices}
        <Form.Field style={{ marginTop: "10px" }}>
          <label>{t("ipInterface")}</label>
          <div className="ipv">
            <div>
              <Radio
                label="IPv4"
                name="IPv4"
                value="4"
                checked={!ipv}
                onChange={() => setIpv((prevState) => !prevState)}
              />
              <Radio
                label="IPv6"
                name="IPv6"
                value="6"
                checked={ipv}
                onChange={() => setIpv((prevState) => !prevState)}
                style={{ margin: "0px 10px" }}
              />
            </div>
          </div>
        </Form.Field>

        <div className="health">
          <h5>{t("healthCheck")}</h5>
          <Checkbox
            label={t("enabled")}
            checked={form.healthcheck_enabled}
            onChange={(e, { checked }) =>
              setForm({
                ...form,
                healthcheck_enabled: checked,
              })
            }
          />
          {form.healthcheck_enabled && (
            <div className="health-wrapper">
              <Form.Field>
                <div>
                  <label>{`${t("path")} ${t("optional")}`}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipPath")}
                    wide="very"
                  />
                </div>
                <Input
                  value={form.healthcheck.path}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        path: e.currentTarget.value,
                      },
                    })
                  }
                  placeholder="/"
                />
              </Form.Field>
              <div>
                <div>
                  <label>{`${t("scheme")} ${t("optional")}`}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipScheme")}
                    wide="very"
                  />
                </div>
                <Dropdown
                  selection
                  clearable
                  value={form.healthcheck.scheme}
                  options={optionsOfScheme}
                  placeholder={t("scheme")}
                  style={{ width: "100%" }}
                  selectOnBlur={false}
                  onChange={(e, data) =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        scheme: data.value,
                      },
                    })
                  }
                />
              </div>
              <Form.Field
                error={
                  !(
                    isFQDN(form.healthcheck.hostname) ||
                    form.healthcheck.hostname === ""
                  )
                }
              >
                <div>
                  <label>{`${t("hostname")} ${t("optional")}`}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipHostName")}
                    wide="very"
                  />
                </div>
                <Input
                  type="text"
                  value={form.healthcheck.hostname}
                  placeholder={t("enterHostname")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        hostname: e.currentTarget.value,
                      },
                    })
                  }
                />
              </Form.Field>
              <Form.Field>
                <div>
                  <label>{`${t("port")} ${t("optional")}`}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipPort")}
                    wide="very"
                  />
                </div>
                <Input
                  value={form.healthcheck.port}
                  placeholder={`${t("enterPort")} ${t("exampleOfPort")}`}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        port: e.currentTarget.value,
                      },
                    })
                  }
                />
              </Form.Field>
              <Form.Field>
                <div>
                  <label>{t("intervalSec")}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipInterval")}
                    wide="very"
                  />
                </div>
                <Input
                  value={form.healthcheck.interval}
                  placeholder={t("enterInterval")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        interval: e.currentTarget.value,
                      },
                    })
                  }
                />
              </Form.Field>
              <Form.Field>
                <div>
                  <label>{t("timeout")}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipTimeout")}
                    wide="very"
                  />
                </div>
                <Input
                  value={form.healthcheck.timeout}
                  placeholder={t("enterTimeout")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        timeout: e.currentTarget.value,
                      },
                    })
                  }
                />
              </Form.Field>
              <HeadersFormSection
                headers={form.healthcheck.headers}
                setHeaders={(newHeaders) =>
                  setForm({
                    ...form,
                    healthcheck: {
                      ...form.healthcheck,
                      headers: newHeaders,
                    },
                  })
                }
              />
              <div>
                <div>
                  <label>{t("followRedirects")}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipFollowRedirect")}
                    wide="very"
                  />
                </div>
                <Radio
                  label={t("trueCheck")}
                  checked={form.healthcheck.follow_redirects}
                  onClick={() =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        follow_redirects: true,
                      },
                    })
                  }
                />
                <Radio
                  label={t("falseCheck")}
                  checked={!form.healthcheck.follow_redirects}
                  onClick={() =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        follow_redirects: false,
                      },
                    })
                  }
                  style={{ margin: "0px 20px" }}
                />
              </div>
              <Form.Field>
                <div>
                  <label>{t("method")}</label>
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    content={t("tooltipMethod")}
                    wide="very"
                  />
                </div>
                <Dropdown
                  selection
                  value={form.healthcheck.method}
                  options={methodsOptions}
                  placeholder={t("enterMethod")}
                  style={{ width: "100%" }}
                  selectOnBlur={false}
                  onChange={(e, data) =>
                    setForm({
                      ...form,
                      healthcheck: {
                        ...form.healthcheck,
                        method: data.value,
                      },
                    })
                  }
                />
              </Form.Field>
            </div>
          )}
        </div>
      </div>
      <div className="routeBlock routeBlockColumn">
        <Header as="h4">{t("security")}</Header>
        <Checkbox
          label={t("traefikSecRoute")}
          checked={secure}
          onChange={(e, { checked }) => {
            setSecure(checked);
          }}
        />
        <span className="subTitleForm">{t("traefikSecRouteDescript")}</span>

        {secure && (
          <>
            <label>{t("tlsTermination")}</label>
            <Dropdown
              selection
              value={form.tls_termination}
              options={tlsOptions}
              placeholder="None"
              onChange={(param, data) =>
                setForm({ ...form, tls_termination: data.value })
              }
            />

            <label style={{ marginTop: "10px" }}>
              {t("traefikInsTraffic")}
            </label>
            <Dropdown
              selection
              clearable
              value={form.insecure}
              options={insecureOptions}
              placeholder="None"
              selectOnBlur={false}
              onChange={(param, data) =>
                setForm({ ...form, insecure: data.value })
              }
            />
            <span className="subTitleForm">
              {t("traefikInsTrafficDescript")}
            </span>

            <label>{t("traefikTlsCertificate")}</label>
            <Dropdown
              selection
              clearable
              value={form.certificate_id}
              options={certificatesOptions}
              placeholder="None"
              selectOnBlur={false}
              onChange={(param, data) =>
                setForm({ ...form, certificate_id: data.value })
              }
            />
          </>
        )}
      </div>
      <div className="formActions">
        <Button
          content={t("cancel")}
          style={{ marginRight: "10px" }}
          onClick={() => setIsOpenCancelChangesModal(true)}
        />
        <Button
          onClick={id ? changeRouteHandler : createRouteHandler}
          primary
          content={id ? t("save") : t("create")}
          disabled={disabledCreateBtn()}
        />
      </div>
      {isOpenCancelChangesModal && (
        <CancelChangesModal
          open={isOpenCancelChangesModal}
          setOpen={openCancelChangesModal}
          type="forRoute"
        />
      )}
    </Form>
  );
};

CreateEditForm.propTypes = {
  type: PropTypes.string,
};

export default CreateEditForm;
