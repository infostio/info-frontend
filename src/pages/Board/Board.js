import React, { Component } from 'react';
import './Board.css'
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from 'lib/cookie';

class Board extends Component {

    state = { 
        title :[
            { 
                title: "글이 없습니다.", 
                id: 0
            }
        ],
        curruntid: 0,
        currunttitle: '글이 없습니다.',
        curruntcontent: '글이 없습니다.',
        category: ''
    }

    jwt = 'Bearer ' + getCookie('JWT')

    componentWillReceiveProps(nextProps) {
        this.getTitle(nextProps);
    }

    componentWillMount() {
        if(!localStorage.getItem('isLogin')) {
            alert('로그인을 해주세요!')
            this.props.history.push('/')
        }
    }

    getTitle = async (nextProps) => {
        try{
            const response = await axios.get(`http://infodsm.club:5000/post/${nextProps.subject}`,{
                headers: { Authorization: this.jwt }
            })
            this.setState({
                title: response.data,
                curruntid: response.data[0].id,
                currunttitle: response.data[0].title,
                curruntcontent: response.data[0].content
            })
        }
        catch (err) {
            console.log(err)
            if (err.response.status === 500) {
                alert('세션이 만료되었습니다.')
                localStorage.clear();
                this.props.history.push('/')
            }
            else {
                alert("오류가 발생하였습니다.")
            }
        }
    }

    deletePost = async () => {
        try {
            await axios.delete(`http://infodsm.club:5000/post/${this.props.subject}/${this.state.curruntid}`,{
                headers: { Authorization: this.jwt }
            });
            alert("게시글이 삭제되었습니다.")
        }
        catch (err) {
            console.log(err)
            if (err.response.status === 500) {
                alert('세션이 만료되었습니다.')
                localStorage.clear();
                this.props.history.push('/')
            }
            else {
                alert('오류가 발생하였습니다.')
            }
        }
    }

    requestPost = async (e) => {
        try {
            const id = e.target.className
            const response = await axios.get(`http://infodsm.club:5000/post/${this.props.subject}/${id}`, {
                headers: {Authorization: this.jwt}
            })
            this.setState({
                curruntid: response.data[0].id,
                curruntcontent: response.data[0].content,
                currunttitle: response.data[0].title
            })
        }
        catch (err) {
            console.log(err)
            if (err.response.status === 500) {
                alert('세션이 만료되었습니다.')
                localStorage.clear();
                this.props.history.push('/')
            }
            else {
                alert('오류가 발생하였습니다.')
            }
        }
    }

    render() {
        const { title } = this.state;

        const titlelist = title.map( title => (
            (<p className={title.id} onClick={this.requestPost}>{title.title}</p>)
        ));
        return (
            <div>
                <div className="Board-wrapper">
                    <div className="Board">
                        <div className="Category">
                            <h2>{this.props.subject}</h2>
                            {titlelist}
                        </div>
                        <div className="Main">
                            <h1 className="Title">{this.state.currunttitle}</h1>
                            <p className="Text">{this.state.curruntcontent}</p>
                        </div>
                    </div>
                    <div className="Buttons">
                        <Link to="/Posting"><button type="submit" className="Create-Button">글쓰기</button></Link>
                        <Link to={{
                            pathname: "/Posting/modify",
                            state: {
                                content: this.state.curruntcontent,
                                title: this.state.currunttitle,
                                id: this.state.curruntid
                            }}}><button type="submit" className="Modify-button">수정</button></Link>
                        <button type="submit" onClick={this.deletePost} className="Delete-button">삭제</button>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default withRouter(Board);