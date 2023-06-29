# @app.route('/api/notifications', methods=['GET'])
# def get_notifications():
#     notifications = list(notification_coll.find())
#     formatted_notifications = [
#         {
#             'id': str(notification['_id']),
#             'title': notification['title'],
#             'text': notification['text'],
#             'date': notification['date']
#         }
#         for notification in notifications
#     ]
#     return jsonify(formatted_notifications)