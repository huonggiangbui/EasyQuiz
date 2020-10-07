import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const HomePage = ({user}) => {
  return (
    <>
        <div class="container-fluid" style={{padding: '0px'}} >
            <div>
                <div className="container">
                    <div className="row" style={{height: '450px', margin: '30px 0px'}}>
                        <div className="col-sm-6 container">
                            <h2 style={{color: '#447cfc'}}>Easy Quiz</h2>
                            <p style={{top: '13%'}}> Phần mềm quản lý, xây dựng và thực hành bài thi trắc nghiệm.</p>
                            <Link to={user ? "/dashboard" : "/login"}><button className="bottomRight">
                                Bắt đầu <i className="fas fa-arrow-right"></i>
                            </button></Link>
                        </div>
                        <div className="col-sm-6 container demo1"></div>
                    </div>
                </div>

                <div className="container">
                    <div className="row" style={{height: '450px', margin: '30px 0px'}} >
                        <div className="col-sm-6 container demo2"></div>
                        <div className="col-sm-6 container">
                            <h2 style={{color: '#447CFC', top: '3%', right: '25%'}} > Về dự án</h2>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            <p className="font-weight-bold" style={{top: '70%'}}>Mục tiêu dự án</p>
                            <p style={{top: '80%'}} >Some text</p>
                            <p style={{top: '85%'}} >Some text</p>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row" style={{height: '300px', margin: '30px 0px'}} >
                        <div className="col-sm-6 container">
                            <h2 style={{color: '#447CFC'}}>Tính năng nổi bật</h2>
                            <p style={{top: '24%'}}><i className="fas fa-caret-right"></i> Dễ dàng xây dựng và quản lý bài tập trắc nghiệm</p>
                            <p style={{top: '35%'}}><i className="fas fa-caret-right"></i> Dễ dàng trích xuất và phân tích kết quả bài tập</p>
                        </div>
                        <div className="col-sm-6 container demo3"></div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default HomePage;