FROM ruby:3.0.0-alpine

RUN apk add --update --no-cache bash build-base nodejs tzdata postgresql-dev yarn shared-mime-info git

WORKDIR /code

COPY package.json yarn.lock /code/
RUN yarn install --check-files

COPY Gemfile Gemfile.lock /code/
RUN bundle install

COPY . /code/

COPY docker/entrypoint.sh docker/entrypoint-clockwork.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh /usr/bin/entrypoint-clockwork.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000
EXPOSE 3035

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
