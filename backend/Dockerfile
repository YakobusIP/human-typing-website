# Use an official lightweight version of Python
FROM python:3.9-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
RUN apk update \
    # psycopg2 dependencies
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    && apk add postgresql-dev \
    # Translations dependencies
    && apk add gettext \
    # Pillow dependencies
    && apk add jpeg-dev zlib-dev libjpeg \
    # CFFI dependencies
    && apk add libffi-dev py-cffi

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Run the application
CMD gunicorn interview_tracker.wsgi:application --bind 0.0.0.0:$PORT