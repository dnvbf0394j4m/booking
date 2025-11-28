import React from "react";
import { Card, Rate, Progress, Row, Col, Typography } from "antd";

const { Text, Title } = Typography;

export default function RatingSummary({ averageRating, reviewCount, histogram }) {
  const avg = Number(averageRating || 0).toFixed(1);

  const total = reviewCount || 0;
  const getPercent = (star) => {
    if (!total) return 0;
    return Math.round(((histogram?.[star] || 0) / total) * 100);
  };

  return (
    <Card>
      <Row gutter={16}>
        <Col span={8} style={{ textAlign: "center" }}>
          <Title level={1} style={{ marginBottom: 0 }}>
            {avg}
          </Title>
          <Rate disabled allowHalf value={Number(avg)} />
          <div>
            <Text type="secondary">{total} đánh giá</Text>
          </div>
        </Col>
        <Col span={16}>
          {[5, 4, 3, 2, 1].map((star) => (
            <Row key={star} align="middle" style={{ marginBottom: 4 }}>
              <Col span={4}>
                <Text>{star} sao</Text>
              </Col>
              <Col span={16}>
                <Progress
                  percent={getPercent(star)}
                  showInfo={false}
                  size="small"
                />
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Text type="secondary">
                  {histogram?.[star] || 0}
                </Text>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </Card>
  );
}
