import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

let brewUrls = {
  anime: { url: 'https://rss.app/feeds/v1.1/_nukbCZjdqY4uubw8.json' },
  beauty: { url: 'https://rss.app/feeds/v1.1/_YRI7FdiEYl2a6b9F.json' },
  blackPopCulture: { url: 'https://rss.app/feeds/v1.1/_8Tib7bkE02swlmp7.json' },
  fashion: { url: 'https://rss.app/feeds/v1.1/_X9X9xi6xSA6xfdiQ.json' },
  fitness: { url: 'https://rss.app/feeds/v1.1/_SeWcuadihnSQLbPV.json' },
  food: { url: 'https://rss.app/feeds/v1.1/_6RwC4gFPZtiWlR0F.json' },
  gaming: { url: 'https://rss.app/feeds/v1.1/_AYgIOThx2i44ju3d.json' },
  market: { url: 'https://rss.app/feeds/v1.1/_fcZVOvvC7xA6iz8u.json' },
  movies: { url: 'https://rss.app/feeds/v1.1/_6QzByBP0Y0E9bL0O.json' },
  sports: { url: 'https://rss.app/feeds/v1.1/_5pZybCiMDbl5fBo8.json' },
  technology: { url: 'https://rss.app/feeds/v1.1/_GNEAg9D5CvYRIxAQ.json' },
  wellness: { url: 'https://rss.app/feeds/v1.1/_ZyirDaQbugpe4PNr.json' },
};

class RssSpillDTO {
  id = undefined;
  profile = { // Task requirement: hardcode for dummy profile (id=0, name="rss", handle="rss")
    id: 0,
    name: 'rss',
    handle: 'rss',
  };
  brew = undefined;
  createdAt = 0;
  text = undefined;
  multiMediaUrl = undefined;
  linkUrl = undefined;
  author = undefined;
  caption = undefined;
  nsfw = false;
  comments = 0;
  likes = 0;
  quotes = 0;
  liked = false;
  quoted = false;
}

function transformRssEntity(rssItem, brew) {
  const rssSpill = new RssSpillDTO();

  rssSpill.brew = brew;
  if (!rssItem) return rssSpill;
  
  rssSpill.id = rssItem.id;
  rssSpill.createdAt = rssItem.date_published;
  rssSpill.text = rssItem.title;
  rssSpill.multiMediaUrl = rssItem.image;
  rssSpill.linkUrl = rssItem.url;
  rssSpill.author = `https://${new URL(rssItem.url || '').hostname}`;
  rssSpill.caption = rssItem.content_text;

  return rssSpill;
}

async function fetchRssItemsByUrl(url, brew) {
  try {
    const response = await fetch(url, {
        method: 'GET',
        credentials: "same-origin",
        referrerPolicy: "no-referrer",
      });
    const result = await response.json();

    if (!result?.items) return [];

    const transformedRssItems = result.items
      .map((item) => transformRssEntity(item, brew));

    return transformedRssItems;
  } catch (error) {
    error.message = `Failed to fetch RSS item:\n${error.message}`;
    throw error;  
  }
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private logger = new Logger('User service');

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    this.logger.log('userById');

    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    return user;
  }

  async getAllUsers() {
    this.logger.log('getAllUsers');

    let result = [];

    try {
      // let response = await fetch('https://rss.app/feeds/v1.1/_nukbCZjdqY4uubw8.json', {
      //   method: 'GET',
      //   credentials: "same-origin",
      //   referrerPolicy: "no-referrer",
      // });
      // result = await response.json();
      // console.log(result);

      const rssItemsTemp = await Promise.all(
        Object.entries(brewUrls).map(([ brew, { url } ]) => fetchRssItemsByUrl(url, brew))
      );
      result = rssItemsTemp.reduce((accum, curr) => ([ ...accum, ...curr, ]), []);
    } catch (err) {
      console.log('ERR: ', err);
    }

    // const users = await this.prisma.user.findMany();

    return result;
  }

  async createUser(
    data: Prisma.UserCreateInput
  ): Promise<User> {
    this.logger.log('createUser');

    const createUser = await this.prisma.user.create({
      data,
    });

    return createUser;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    this.logger.log('updateUser');

    const updateUser = await this.prisma.user.update({
      where: params.where,
      data: params.data,
    });

    return updateUser;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    this.logger.log('deleteUser');

    const deleteUser = await this.prisma.user.delete({
      where,
    });

    return deleteUser;
  }
}
