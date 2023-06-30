import React, { Component } from 'react';
import { Carousel, Card, Button } from 'antd';
import { Carousel as SmartSlider } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './notification.css';
import axios from 'axios';

const { Meta } = Card;

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllNotifications: false,
      notifications: [],
    };
  }

  componentDidMount() {
    this.fetchNotifications();
  }

  fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications');
      console.log(response.data)
      this.setState({ notifications: response.data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  toggleShowAllNotifications = () => {
    this.setState(prevState => ({
      showAllNotifications: !prevState.showAllNotifications
    }));
  };

  render() {
    const { notifications, showAllNotifications } = this.state;

    const carouselImages = [
      { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
      { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
      { id: 3, src: '/images/image3.jpg', alt: 'Image 3' }
    ];

    const displayedNotifications = showAllNotifications
      ? notifications
      : notifications.slice(0, 3);

    return (
      <div>
        <SmartSlider
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          showArrows={false}
          autoPlay
          infiniteLoop
          interval={3000}
          transitionTime={500}
          stopOnHover
          swipeable
        >
          {carouselImages.map(image => (
            <div key={image.id}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </SmartSlider>

        <div className="notification-container">
          {displayedNotifications.map((notification, index) => (
            <Card className="notification-card" key={index}>
              <Meta title={"Notification " + (index + 1) + ": " + notification.scheme_name} description={notification.message} />
            </Card>
          ))}
        </div>

        <div className="notification-toggle">
          <Button type="primary" onClick={this.toggleShowAllNotifications}>
            {showAllNotifications ? 'Hide Notifications' : 'See All Notifications'}
          </Button>
        </div>
      </div>
    );
  }
}
