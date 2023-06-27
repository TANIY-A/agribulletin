import React, { Component } from 'react';
import { Carousel, Card, Button } from 'antd';
import { Carousel as SmartSlider } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './notification.css';

const { Meta } = Card;

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllNotifications: false
    };
  }

  toggleShowAllNotifications = () => {
    this.setState(prevState => ({
      showAllNotifications: !prevState.showAllNotifications
    }));
  };

  render() {
    const carouselImages = [
      { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
      { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
      { id: 3, src: '/images/image3.jpg', alt: 'Image 3' }
    ];

    const notifications = [
      { id: 1, title: 'Notification 1', text: 'Description.', date: '2 days ago' },
      { id: 2, title: 'Notification 2', text: 'Description.', date: '2 days ago' },
      { id: 3, title: 'Notification 3', text: 'Description.', date: '2 days ago' },
      { id: 4, title: 'Notification 4', text: 'Description.', date: '2 days ago' },
      { id: 5, title: 'Notification 5', text: 'Description.', date: '2 days ago' }
    ];

    const displayedNotifications = this.state.showAllNotifications
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
          {displayedNotifications.map(notification => (
            <Card className="notification-card" key={notification.id}>
              <Meta title={notification.title} description={notification.text} />
              <p className="notification-date">{notification.date}</p>
              <a href={`/pdfs/${notification.id}.pdf`} target="_blank" rel="noopener noreferrer">
                Details
              </a>
            </Card>
          ))}
        </div>

        <div className="notification-toggle">
          <Button
            type="primary"
            onClick={this.toggleShowAllNotifications}
          >
            {this.state.showAllNotifications ? 'Hide Notifications' : 'See All Notifications'}
          </Button>
        </div>
      </div>
    );
  }
}
