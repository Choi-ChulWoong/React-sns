import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Button, List, Icon } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import styled from "styled-components";
import moment from "moment";

const MyProfileHeader = styled.div`
  display: flex;
  margin: 15px;
  max-width: 1000px;
  height: 111px;
`;
const MyProfileAvatar = styled.div`
  padding-top: 10px;
  margin-right: 15px;
`;
const MyProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
`;

const MyProfileNickname = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e6e6e6;
  & a {
    max-width: 85%;
    margin-right: 5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #262626;
  }
  & i {
    padding-top: 4px;
    width: 10%;
    cursor: pointer;
  }
`;

const MyProfileFollowInfo = styled.div`
  display: flex;
  padding: 10px 0;
  justify-content: space-between;
  text-align: center;
  color: #9d9d9d;
  & div div {
    line-height: 13px;
    font-weight: 600;
    color: #262626;
  }
`;

const MyPostListContainer = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #ffffff;
  height: 300px;
`;
const MyPostList = styled.div`
  overflow: auto;
  padding: 8px 12px 8px 0px;
  height: 85%;
`;
const MyPostListHeader = styled.div`
  padding: 15px;
  height: 15%;
  font-weight: 600;
  color: #cccccc;
`;

const UserProfile = () => {
  const [guestNum, setGuestNum] = useState("");
  const { me } = useSelector(state => state.user);
  const { userPosts } = useSelector(state => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    const rannum = Math.floor(Math.random() * 10000) - 1;
    setGuestNum(rannum);
  }, []);

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_USER_POSTS_REQUEST,
  //     data: me && me.id
  //   });
  // }, [me]);
  // 두번씩 로드되는거 해결하려고 주석처리함

  const onLogout = useCallback(e => {
    e.preventDefault();
    dispatch({
      type: LOG_OUT_REQUEST
    });
  }, []);

  return (
    <>
      <MyProfileHeader>
        <MyProfileAvatar>
          {me ? (
            <Link href="/profile" key="profile">
              <a>
                <Avatar
                  size={77}
                  icon="user"
                  style={{
                    backgroundColor: "#87d068"
                  }}
                />
              </a>
            </Link>
          ) : (
            <Avatar
              size={77}
              style={{
                backgroundColor: "#87d068",
                fontSize: "40px",
                fontWeight: "600"
              }}
            >
              G
            </Avatar>
          )}
        </MyProfileAvatar>
        <MyProfileInfo>
          <MyProfileNickname>
            <Link href="/profile" key="profile2">
              <a>{me ? me.nickname : "Guest " + guestNum}</a>
            </Link>
            {me ? <Icon type="logout" onClick={onLogout} /> : null}
          </MyProfileNickname>
          <MyProfileFollowInfo>
            <div>
              게시물 <div>{me && me.Posts ? me.Posts.length : 0}</div>
            </div>
            <div>
              팔로워 <div>{me && me.Followers ? me.Followers.length : 0}</div>
            </div>
            <div>
              팔로우 <div>{me && me.Followings ? me.Followings.length : 0}</div>
            </div>
          </MyProfileFollowInfo>
        </MyProfileInfo>
      </MyProfileHeader>

      <Link href="/postup" key="post">
        <a>
          <Button
            type="dashed"
            icon="plus"
            style={{ height: "40px", fontSize: "25px", color: "#CCCCCC" }}
            block
          ></Button>
        </a>
      </Link>

      {me ? (
        <MyPostListContainer>
          <MyPostListHeader>나의 게시물</MyPostListHeader>
          <MyPostList>
            <List
              dataSource={userPosts}
              renderItem={item => (
                <Link
                  href={{ pathname: "/post", query: { id: item.id } }}
                  as={`/post/${item.id}`}
                >
                  <a>
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={60}
                            shape="square"
                            src={
                              item.Images[0]
                                ? `http://localhost:8080/${item.Images[0].src}`
                                : null
                            }
                            icon="picture"
                          />
                        }
                        title={moment(item.createdAt, "YYYYMMDD").fromNow()}
                        description={<div>{item.content}</div>}
                      />
                    </List.Item>
                  </a>
                </Link>
              )}
            ></List>
          </MyPostList>
        </MyPostListContainer>
      ) : null}
    </>
  );
};

export default UserProfile;
