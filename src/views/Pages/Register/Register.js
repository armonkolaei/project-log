import React, { Component } from 'react';
//import { Redirect } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';
import urls from '../../../urls.json';
import Modal from 'react-responsive-modal';
const customStyles = {
  content: {
    width: 'auto',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};
class Register extends Component {


  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      company_name: '',
      contact_name: '',
      referral_code: '',
      auth_token: '',
      loading: false,
      terms: false,
      register_success: false,
      isEmailVerified: false,
      modalIsOpen: false,
      modalPrivacyIsOpen: false,
    }

    this.registerUser = this.registerUser.bind(this);
    this.updateEmailState = this.updateEmailState.bind(this);
    this.updatePasswordState = this.updatePasswordState.bind(this);
    this.updateCompanyNameState = this.updateCompanyNameState.bind(this);
    this.updateContactNameState = this.updateContactNameState.bind(this);
    this.updateReferralCodeState = this.updateReferralCodeState.bind(this);
    this.updateTermsState = this.updateTermsState.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }
  handleClick() {
    this.setState({ modalIsOpen: true });
  }
  handleClickPrivacy() {
    this.setState({ modalPrivacyIsOpen: true });
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  PrivacycloseModal() {
    this.setState({ modalPrivacyIsOpen: false });
  }
  setCheckboxStates(attr) {
    //console.log( $("#"+attr).prop("checked"));
    if ($("#" + attr).prop("checked") == true) {
      $("#" + attr).val(1);
    }
    else {
      $("#" + attr).val(0);
    }
    // $("#"+attr).val($("#"+attr).checked ? 1 : 0);
  }
  updateTermsState(e) {
    this.setState({ terms: e.target.value });
  }

  registerUser() {

    let { history } = this.props;

    if (this.state.terms) {
      this.setState({ loading: true });
      $.ajax({
        url: `${urls.server}/users/register`,
        type: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        data: JSON.stringify({
          "email": this.state.email,
          "contact_name": this.state.contact_name,
          "company_name": this.state.company_name,
          "referral_code": this.state.referral_code,
          "password": this.state.password
        })
      }).then((json) => {

        let { data } = json;

        if (data.Authorization) {
          //localStorage.setItem("jwt", data.Authorization);
          localStorage.setItem("user", JSON.stringify(data.user));
          this.setState({ loading: false, register_success: true, auth_token: data.Authorization });
          //history.push('/portal_select');
        }

      }).catch((error) => {
        var err = error.responseJSON;
        this.setState({ loading: false });
        if (typeof err.message !== 'undefined') {
          //alert(err.message);
          toast.error(err.message, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      });
    }
    else {
      toast.error("Please accepts our terms", {
        position: toast.POSITION.TOP_CENTER
      });
      //alert("Please accepts our terms");
      return false;
    }

  }
  getProfile() {
    this.setState({ loading: true });
    console.log("HERE");
    let { history } = this.props;
    $.ajax({
      url: `${urls.server}/user/bysession`,
      headers: {
        "Content-type": "application/json",
        "X-Authorization": this.state.auth_token,
        //"X-Profile": this.state.x_profile
      }
    }).then((json) => {
      this.setState({ loading: false });
      let data = json.data;
      console.log("Profile data", data);
      console.log("EMAIL VERIFIED", data.email_verified);
      if (data.email_verified === "0") {
        toast.error("Email is not verified yet", {
          position: toast.POSITION.TOP_CENTER
        });
      }
      else {
        localStorage.setItem("jwt", this.state.auth_token);
        setTimeout(function () { history.push('/portal_select'); }.bind(this), 1000);

      }

    }).catch((error) => {
      console.log("error", error);
      //alert(error.responseText);		  
    });

  }
  verifyEmail() {
    this.setState({ loading: true });
    $.ajax({
      url: `${urls.server}/users/verifyemail`,
      headers: {
        "Content-type": "application/json",
        "X-Authorization": this.state.auth_token,
        //"X-Profile": this.state.x_profile
      }
    }).then((json) => {
      let { data } = json;
      this.setState({ loading: false });
      console.log("SUCCESS", json);
      toast.success(json.message, {
        position: toast.POSITION.TOP_CENTER
      });

    }).catch((error) => {
      //console.log("ERROR",error);
      this.setState({ loading: false });
      //alert(error);

    });
  }
  updateEmailState(e) {
    this.setState({ email: e.target.value });
  }

  updatePasswordState(e) {
    this.setState({ password: e.target.value });
  }

  updateCompanyNameState(e) {
    this.setState({ company_name: e.target.value });
  }

  updateContactNameState(e) {
    this.setState({ contact_name: e.target.value });
  }

  updateReferralCodeState(e) {
    if (e.target.value.length >= 15) {
      toast.error("Referral code is invalid", {
        position: toast.POSITION.TOP_CENTER
      });
      this.setState({ referral_code: '' });
    } else {
      this.setState({ referral_code: e.target.value });
    }
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
        {
          this.state.loading ?
            <div className="sk-wave">
              <div className="sk-rect sk-rect1"></div>
              <div className="sk-rect sk-rect2"></div>
              <div className="sk-rect sk-rect3"></div>
              <div className="sk-rect sk-rect4"></div>
              <div className="sk-rect sk-rect5"></div>
            </div>
            :
            <div className="container">
              <div className="row justify-content-center">
                {!this.state.register_success ? (<div className="col-md-6">
                  <div className="card mx-4">
                    <div className="card-block p-4">
                      <h1>Register</h1>
                      <p className="text-muted">Create your account</p>
                      <div className="input-group mb-3">
                        <span className="input-group-addon">@</span>
                        <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={this.updateEmailState} />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-addon"><i className="icon-lock"></i></span>
                        <input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.updatePasswordState} />
                      </div>
                      {/* Company Name */}
                      <div className="input-group mb-3">
                        <span className="input-group-addon"><i className="icon-user"></i></span>
                        <input type="text" className="form-control" placeholder="Company Name" value={this.state.company_name} onChange={this.updateCompanyNameState} />
                      </div>
                      {/* Contact Name */}
                      <div className="input-group mb-3">
                        <span className="input-group-addon"><i className="icon-user"></i></span>
                        <input type="text" className="form-control" placeholder="Contact Name" value={this.state.contact_name} onChange={this.updateContactNameState} />
                      </div>
                      {/* Referral code */}
                      <div className="input-group mb-3">
                        <span className="input-group-addon"><i className="icon-pencil"></i></span>
                        <input type="text" className="form-control" placeholder="Referral Code" value={this.state.referral_code} onChange={this.updateReferralCodeState} />
                      </div>
                      <div className="input-group mb-4 tearms-service-register">
                        <input type="checkbox" id="terms" onClick={this.setCheckboxStates.bind(this, "terms")} value={this.state.terms} onChange={this.updateTermsState} /> I agree to the  <a href="#" onClick={this.handleClick.bind(this)}>terms of service</a>
                      </div>

                      <button type="button" className="btn btn-block btn-success" onClick={this.registerUser}>Create Account</button>

                      <div className="input-group mb-4 policy-privacy-register">
                        <a href="#" onClick={this.handleClickPrivacy.bind(this)}>Privacy Policy</a>
                      </div>
                    </div>

                  </div>
                </div>) : (<div className="col-md-6">
                  <div className="card mx-4">
                    <div className="card-block p-4">
                      <h4 style={{ marginBottom: '15px' }}>We have sent you an email to verify your email address. Please check your mailbox and be sure to check your junk mail as well.</h4>

                      <button className="btn btn-block btn-success" onClick={this.getProfile}>Continue</button>
                      <button className="btn btn-block btn-success" onClick={this.verifyEmail}>Resend Email</button>
                    </div>
                  </div>
                </div>)}
              </div>
            </div>
        }
        <Modal open={this.state.modalPrivacyIsOpen} onClose={this.PrivacycloseModal.bind(this)} modalStyle={customStyles}>
          <div className="app flex-row align-items-center">
            <div className="container">
              <div className="row justify-content-center">
                <div className="tos-box-detail">
                  <p className="title">MOTHERCLOCK’S</p>
                  <h1 className="sub-title">Privacy Policy</h1>
                  <p>MotherClock Inc. handles confidential financial information from its customers, Canadian corporations,
                  companies or persons in the process of providing services. When you use these services you trust us
                  with your information. This Privacy Policy is meant to help you understand what data we collect, why we
    collect it, and what we do with it. </p>
                  <p>We collect information primarily to provide services to our users. We also use this information internally
                  to learn how to provide, maintain and improve our services to our users, and to protect MotherClock
                  and our users. We will never use your information for any other purpose without your express written
    consent. </p>
                  <p>We collect information that you give to us and based on your use of our services including: </p>
                  <p>• device-specific information</p>
                  <p>• location information</p>
                  <p>• details of how you used our service</p>
                  <p>• Internet protocol address</p>
                  <p>• cookies that may uniquely identify your browser or your MotherClock Account </p>

                  <p>Data security is our highest priority. We maintain a very high level of protection against unauthorized
    intrusion. Every member of our team pledges their commitment to keep your data private and safe. </p>
                  <p>Our Privacy Policy applies to all of the services offered by MotherClock Inc. The policy may change from
                  time to time. We will post any privacy policy changes on this page and, if the changes are significant, we
                  will provide a more prominent notice (including, for certain services, email notification of privacy policy
    changes). </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal open={this.state.modalIsOpen} onClose={this.closeModal.bind(this)} modalStyle={customStyles}>
          <div className="app flex-row align-items-center">
            <div className="container">
              <div className="row justify-content-center">
                <div className="tos-box-detail">
                  <p className="title">MOTHERCLOCK’S</p>
                  <h1 className="sub-title">TERMS OF SERVICE</h1>
                  <p>Your use of MotherClock’s products, software, services and web sites (referred to collectively as the
                  “Services” in this document and excluding any services provided to you by MotherClock under a
                  separate written agreement) is subject to the terms of a legal agreement between you and
                  MotherClock. “MotherClock” means MotherClock Inc., whose principal place of business is at 149
Burleigh Street, Apsley, ON K0L 1A0, Canada.</p>
                  <p>In order to use the Services, you must first agree to the Terms. You may not use the Services if you do
not accept the Terms.</p>
                  <p>You can accept the Terms by:</p>
                  <p>(A) clicking to accept or agree to the Terms, where this option is made available to you by MotherClock
in the user interface for any Service; or</p>
                  <p>(B) using the Services. In this case, you understand and agree that MotherClock will treat your use of the
Services as acceptance of the Terms from that point onwards.</p>
                  <p>You may not use the Services and may not accept the Terms if (a) you are not of legal age to form a
                  binding contract with MotherClock, or (b) you are a person barred from receiving the Services under the
                  laws of Canada or other countries including the country in which you are resident or from which you use
the Services.</p>
                  <p>In order to access certain Services, you may be required to provide information about yourself or your
                  employees (such as identification or contact details) as part of the registration process for the Service, or
                  as part of your continued use of the Services. You agree that any registration information you give to
MotherClock will always be accurate, correct and up to date.</p>
                  <p>While we will do everything possible to ensure that the Services meets and exceeds your expectations,
you expressly understand and agree that:</p>
                  <p>(A) your use of the Services is at your sole risk and that the Services are provided “as is” and “as
available”; and</p>
                  <p>(B) MotherClock, its subsidiaries and affiliates, and its licensors shall not be liable to you for any reason.</p>
                  <p>MotherClock may make changes to the Terms and Conditions or Additional Terms from time to time.
                  When these changes are made, MotherClock will make a new copy of the Terms and Conditions
available at <a href="#">http://www.motherclock.com/termsofservice.html</a> and any new Additional Terms will be
made available to you from within, or through, the affected Services.</p>
                  <p>You understand and agree that if you use the Services after the date on which the Terms and Conditions
                  or Additional Terms have changed, MotherClock will treat your use as acceptance of the updated Terms
and Conditions or Additional Terms.</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Register;
