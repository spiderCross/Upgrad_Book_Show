import * as React from "react";
import {
  Button,
  Tab,
  Tabs,
  FormControl,
  Input,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";
import Modal from "react-modal";

import "./Header.css";

const Header = (props) => {
  //const [props.props.isLogin, props.setIsLogin] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const loginButtonClickHandler = () => {
    if (!props.isLogin) {
      setIsModalOpen(true);
    } else {
      userLogout();
      props.setIsLogin(false);
    }
  };
  const userLogout = async () => {
    let token = sessionStorage.getItem("access-token");
    fetch(`${props.baseUrl}auth/logout`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        authorization: `Bearer ${token}`,
      },
    });
    sessionStorage.clear();
  };

  const handleClose = () => {
    props.setIsLogin(true);
    setIsModalOpen(false);
  };
  const onBookShowButtonClicked = () => {
    if (!props.isLogin) {
      setIsModalOpen(true);
    } else {
      let id = window.location.pathname.split("/")[2];
      window.location.href = "/confirm/" + id;
    }
  };
  Modal.setAppElement("#root");

  return (
    <nav className="header">
      <div className="logo rotating"></div>
      <div>
        {props.isShowBook && (
          <Button
            variant="contained"
            color="primary"
            className="right"
            onClick={onBookShowButtonClicked}
          >
            Book Show
          </Button>
        )}

        <Button
          variant="contained"
          color="default"
          onClick={loginButtonClickHandler}
        >
          {!props.isLogin ? "Login" : "Logout"}
        </Button>
      </div>
      <Modal isOpen={isModalOpen}>
        {<ModalTabView onClose={handleClose} baseUrl={props.baseUrl} />}
      </Modal>
    </nav>
  );
};

const ModalTabView = (Modalprops) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  const TabPanel = (props) => {
    switch (props.value) {
      case 0:
        return (
          <LoginForm
            onClose={Modalprops.onClose}
            baseUrl={Modalprops.baseUrl}
          />
        );
      case 1:
        return <RegisterForm baseUrl={Modalprops.baseUrl} />;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="disabled tabs example"
        centered
        variant="fullWidth"
        className="tabs"
      >
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      <TabPanel value={tabValue} />
    </React.Fragment>
  );
};

const LoginForm = (props) => {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [reqUsername, setReqUsername] = React.useState("dispNone");
  const [reqPassword, setReqPassword] = React.useState("dispNone");
  const [credInfo, setCredInfo] = React.useState("dispNone");
  const [errorMessage, setErrorMessage] = React.useState("");

  const onUserNameInputChange = (event) => {
    setUserName(event.target.value);
  };

  const onPasswordInputChange = (event) => {
    setPassword(event.target.value);
  };
  const loginButtonClickHandler = (event) => {
    event.preventDefault();
    userName === "" ? setReqUsername("dispBlock") : setReqUsername("dispNone");
    password === "" ? setReqPassword("dispBlock") : setReqPassword("dispNone");
    if (userName !== "" && password !== "") {
      userLogin(userName, password);
    }
  };

  const userLogin = async (userName, password) => {
    let token = `Basic ${btoa(`${userName}:${password}`)}`;
    const response = await fetch(`${props.baseUrl}auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json;charset=UTF-8",
        Authorization: token,
      },
    });
    const data = await response.json();

    if (response.ok) {
      setCredInfo("dispNone");
      sessionStorage.setItem(
        "access-token",
        response.headers.get("access-token")
      );
      props.onClose();
    } else {
      setErrorMessage(data.message);
      setCredInfo("dispBlock");
    }
  };

  return (
    <div className="tabPanel">
      <FormControl required className="formControl">
        <InputLabel htmlFor="userName">User Name</InputLabel>
        <Input id="userName" type="text" onChange={onUserNameInputChange} />
        <FormHelperText className={reqUsername}>
          <span className="red">Required</span>
        </FormHelperText>
      </FormControl>
      <br />
      <FormControl required className="formControl">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input id="password" type="password" onChange={onPasswordInputChange} />
        <FormHelperText className={reqPassword}>
          <span className="red">Required</span>
        </FormHelperText>
      </FormControl>
      <br />
      <Button
        color="primary"
        variant="contained"
        onClick={loginButtonClickHandler}
      >
        Login
      </Button>
      <br />
      <span className={`red ${credInfo}`}>{errorMessage}</span>
    </div>
  );
};

const RegisterForm = (props) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [reqFirstName, setReqFirstName] = React.useState("dispNone");
  const [reqLastName, setReqLastName] = React.useState("dispNone");
  const [reqEmail, setReqEmail] = React.useState("dispNone");
  const [reqPassword, setReqPassword] = React.useState("dispNone");
  const [reqContact, setReqContact] = React.useState("dispNone");
  const [reqRegister, setReqRegister] = React.useState("dispNone");

  const onRegisterButtonClick = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    firstName === ""
      ? setReqFirstName("dispBlock")
      : setReqFirstName("dispNone");
    lastName === "" ? setReqLastName("dispBlock") : setReqLastName("dispNone");
    contact === "" ? setReqContact("dispBlock") : setReqContact("dispNone");
    email === "" ? setReqEmail("dispBlock") : setReqEmail("dispNone");
    password === "" ? setReqPassword("dispBlock") : setReqPassword("dispNone");

    if (
      firstName !== "" &&
      lastName !== "" &&
      contact !== "" &&
      email !== "" &&
      password !== ""
    ) {
      userRegister(firstName, lastName, email, password, contact);
    }
  };

  const userRegister = async (
    firstName,
    lastName,
    email,
    password,
    contact
  ) => {
    let payload = {
      email_address: email,
      first_name: firstName,
      last_name: lastName,
      mobile_number: contact,
      password: password,
    };
    const response = await fetch(`${props.baseUrl}signup`, {
      method: "POST",
      headers: {
        Accept: "application/json;charset=UTF-8",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      setReqRegister("dispBlock");
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="tabPanel">
      <FormControl required className="formControl">
        <InputLabel htmlFor="fname">First Name</InputLabel>
        <Input
          id="fname"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <FormHelperText className={reqFirstName}>
          <span className="red">Required</span>
        </FormHelperText>
      </FormControl>
      <br />

      <FormControl required className="formControl">
        <InputLabel htmlFor="lname">Last Name</InputLabel>
        <Input
          id="lname"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
        <FormHelperText className={reqLastName}>
          <span className="red">Required</span>
        </FormHelperText>
      </FormControl>
      <br />

      <FormControl required className="formControl">
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <FormHelperText className={reqEmail}>
          <span className="red">Required</span>
        </FormHelperText>
      </FormControl>
      <br />

      <FormControl required className="formControl">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
        />
        <FormHelperText className={reqPassword}>
          <span className="red">Required</span>
        </FormHelperText>
      </FormControl>
      <br />

      <FormControl required className="formControl">
        <InputLabel htmlFor="contact">Contact No.</InputLabel>
        <Input
          id="contact"
          onChange={(e) => {
            setContact(e.target.value);
          }}
        />
        <FormHelperText className={reqContact}>
          <span className="red">Required</span>
        </FormHelperText>
      </FormControl>
      <br />

      <Button
        color="primary"
        variant="contained"
        type="submit"
        onClick={onRegisterButtonClick}
      >
        Register
      </Button>
      <br />
      <span className={reqRegister}>
        Registration Successful. Please Login!
      </span>
      {errorMessage && <p className="red">{errorMessage}</p>}
    </div>
  );
};

export default Header;
