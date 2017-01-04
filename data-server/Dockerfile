FROM python:3.5
ADD ./dist /dist
# Add crontab file in the cron directory
ADD ./dist/crontab /etc/cron.d/vismooc-cron
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/vismooc-cron
WORKDIR /dist
RUN pip install -r requirements.txt
CMD ["cron", "&&", "python", "main.py", "../../config/config.json"]