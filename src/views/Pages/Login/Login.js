import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
// import 'react-toastify/dist/ReactToastify.min.css';

import urls from "../../../urls.json";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "email",
      email: "",
      auth_token: "",
      password: "",
      success: false,
      loading: false,
      login_success: false
    };
    this.loginUser = this.loginUser.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updatePasswordState = this.updatePasswordState.bind(this);
    // this.getProfile = this.getProfile.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  // getProfile() {
  //
  // 	let { history } = this.props;
  // 	$.ajax({
  // 	  url: `${urls.server}/user/bysession`,
  // 	  headers: {
  // 		"Content-type": "application/json",
  // 		"X-Authorization": this.state.auth_token,
  // 		//"X-Profile": this.state.x_profile
  // 	  }
  // 	}).then((json) => {
  //
  // 	let data = json.data;
  // 	console.log("Profile data",data);
  // 	console.log("EMAIL VERIFIED",data.email_verified);
  // 	if(data.email_verified === "0")
  // 	{
  // 		this.setState({loading:false,login_success:true});
  // 		toast.error("Email is not verified yet", {
  // 		  position: toast.POSITION.TOP_CENTER
  // 		});
  // 	}
  // 	else
  // 	{
  // 		localStorage.setItem("jwt", this.state.auth_token);
  // 		this.setState({loading:false},function(){
  // 			history.push('/portal');
  // 		});
  // 		//setTimeout(function() {  }.bind(this), 1000);
  // 	}
  //
  // 	}).catch((error) => {
  // 	  console.log("error",error);
  // 	  //alert(error.responseText);
  // 	});
  //
  // }
  verifyEmail() {
    this.setState({ loading: true });
    $.ajax({
      url: `${urls.server}/users/verifyemail`,
      headers: {
        "Content-type": "application/json",
        "X-Authorization": this.state.auth_token
        //"X-Profile": this.state.x_profile
      }
    })
      .then(json => {
        let { data } = json;
        this.setState({ loading: false });
        console.log("SUCCESS", json);
        toast.success(json.message, {
          position: toast.POSITION.TOP_CENTER
        });
      })
      .catch(error => {
        //console.log("ERROR",error);
        this.setState({ loading: false });
        //alert(error);
      });
  }
  handleOnClick = () => {
    // some action...
    // then redirect
    this.setState({ redirect: true });
  };

  componentDidMount() {}

  updateState(e) {
    this.setState({ email: e.target.value });
  }

  updatePasswordState(e) {
    this.setState({ password: e.target.value });
  }

  loginUser() {
    let { history } = this.props;
    this.setState({ loading: true });
    $.ajax({
      url: `${urls.server}/users/login`,
      type: "POST",
      headers: {
        "Content-type": "application/json"
      },
      data: JSON.stringify({
        type: this.state.type,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(json => {
        let { data } = json;
        //this.setState({loading:false});
        if (data.Authorization) {
          localStorage.setItem("user", JSON.stringify(data.user));
          this.setState({ auth_token: data.Authorization }, function() {
            localStorage.setItem("jwt", this.state.auth_token);
            this.setState({ loading: false }, function() {
              history.push("/portal");
            });
            setTimeout(function() {}.bind(this), 1000);
          });
        }
      })
      .catch(error => {
        var err = error.responseJSON;
        this.setState({ loading: false });
        if (typeof err.message !== "undefined") {
          //alert("Invalid username and password !");
          toast.error("Invalid username and password !", {
            position: toast.POSITION.TOP_CENTER
          });
        }
      });
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <ToastContainer
          position="top-left"
          type="default"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        {this.state.loading ? (
          <div className="sk-wave">
            <div className="sk-rect sk-rect1" />
            <div className="sk-rect sk-rect2" />
            <div className="sk-rect sk-rect3" />
            <div className="sk-rect sk-rect4" />
            <div className="sk-rect sk-rect5" />
          </div>
        ) : (
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        <h1>Login</h1>

                        <p className="text-muted">Sign In to your account</p>

                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user" />
                            </InputGroupText>
                          </InputGroupAddon>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.updateState}
                          />
                        </InputGroup>

                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock" />
                            </InputGroupText>
                          </InputGroupAddon>

                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.updatePasswordState}
                          />
                        </InputGroup>

                        <Row>
                          <Col xs="6">
                            <button
                              type="button"
                              onClick={this.loginUser}
                              className="btn btn-primary px-4"
                            >
                              Login
                            </button>
                          </Col>

                          <Col xs="6" className="text-right">
                            <Link
                              to="/recover_password"
                              className="btn btn-link px-0"
                            >
                              Forgot password?
                            </Link>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>

                  <Card
                    className="text-white bg-primary py-5 d-md-down-none"
                    style={{ width: 44 + "%" }}
                  >
                    <CardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>

                        <p>Sign up to discover the noodles.</p>

                        <Link
                          className="btn btn-primary active mt-3"
                          to="/register"
                        >
                          Register Now!
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}

export default Login;
// export default withRouter(Login);
