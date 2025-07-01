import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardBody, Col, Row } from "reactstrap";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <Card className="mt-1 px-3">
            <CardBody>
              <div className="error-icon fw-bold ri-spam-2-fill" />
              <div className="fs-1 ps-2 fw-bold">OOPS!</div>
              <Row className="d-flex justify-content-between align-items-center">
                <Col className="ps-4" md={10}>
                  Something went wrong please try again later
                </Col>
                <Col md={2}>
                  <Button onClick={() => window.location.reload()}>
                    Reload
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element,
};

export default ErrorBoundary;
