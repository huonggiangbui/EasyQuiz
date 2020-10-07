import React from "react";
import "./styles.css";

const Footer = () => {
  return (
    <div>
      <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous" />
            <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet" />
      </head>

      <div className="container-fluid" style={{padding: '0px'}} >
        <footer>
            <div className="row text-center text-md-left pr-3">
                <div className="item contact container">
                    <div style={{position: 'absolute', top: '50%', left: '45%'}}>
                        <a className="fb-ic" href="https://www.facebook.com/zang2301">
                            <i className="fab fa-facebook-f fa-2x"> </i>
                        </a>
                        <a className="li-ic" href="https://www.linkedin.com/in/giang-bui-huong-5949b8121/">
                            <i className="fab fa-linkedin-in fa-2x"> </i>
                        </a>
                        <a className="git-ic" href="https://github.com/huonggiangbui">
                            <i className="fab fa-github fa-2x"> </i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-copyright text-center">@ Copyright by Giang Bui Huong. All rights reserved. Various Trademarks held by their respective owners.</div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;