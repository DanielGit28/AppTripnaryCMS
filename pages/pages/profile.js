// import node module libraries
import { Col, Row, Container } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

// import widget as custom components
import { PageHeading } from "widgets";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

// import sub components
import {
  AboutMe,
  ActivityFeed,
  MyTeam,
  ProfileHeader,
  ProjectsContributions,
  RecentFromBlog,
} from "sub-components";

const Profile = () => {

  const { user } = useAuthContext()
  const { userInfo } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
   
    if (user == null) router.push("/")
  }, [user])

  const Layout =
    Component.Layout ||
    (router.pathname && router.pathname.includes("dashboard")
      ? router.pathname.includes("instructor") ||
        router.pathname.includes("student")
        ? DefaultDashboardLayout
        : DefaultDashboardLayout
      : DefaultDashboardLayout);

  return (
    <Layout>
      <Container fluid className="p-6">
        {/* Page Heading */}

      {/* Profile Header  */}
      <ProfileHeader />

        {/* content */}
        <div className="py-6">
          <Row>
            {/* About Me */}
            <AboutMe />

            {/* Projects Contributions */}
            <ProjectsContributions />

            {/* Recent From Blog */}
            <RecentFromBlog />

            <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
              {/* My Team */}
              <MyTeam />

              {/* Activity Feed */}
              <ActivityFeed />
            </Col>
          </Row>
        </div>
      </Container>
    </Layout>
  );
};

export default Profile;
