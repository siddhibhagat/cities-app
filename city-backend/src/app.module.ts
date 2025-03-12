import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './cities/cities.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('AppModule');

@Module({
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true
  //   }),
  //   // MongooseModule.forRoot('mongodb://admin:password@localhost:27017/cities-db?authSource=admin'),
  //   // MongooseModule.forRootAsync({
  //   //   useFactory: async () => {
  //   //     const MONGO_URI = 'mongodb://admin:password@localhost:27017/citiesDB';
  //   //     let retries = 5;

  //   //     while (retries) {
  //   //       try {
  //   //         logger.log(`Attempting to connect to MongoDB...`);
  //   //         return { uri: MONGO_URI };
  //   //       } catch (error) {
  //   //         logger.warn(`MongoDB connection failed. Retries left: ${retries - 1}`);
  //   //         retries--;
  //   //         await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
  //   //       }
  //   //     }

  //   //     logger.error('Could not connect to MongoDB after multiple attempts.');
  //   //     return { uri: '' }; // Fallback (server will still start)
  //   //   },
  //   // }),
  //   MongooseModule.forRootAsync({
  //     imports: [ConfigModule],
  //     useFactory: async (configService: ConfigService) => {
  //       const MONGO_URI = configService.get<string>('MONGODB_URI');
  //       logger.log(`Attempting to connect to MongoDB...`);

  //       try {
  //         // Attempt to connect to MongoDB
  //         return { uri: MONGO_URI };
  //       } catch (error) {
  //         // Log the error but allow the server to start
  //         logger.error('Failed to connect to MongoDB:', error.message);
  //         return { uri: '' }; // Return an empty URI to prevent Mongoose from attempting to connect
  //       }
  //     },
  //     inject: [ConfigService],
  //   }),
  //   CitiesModule
  // ],
  // controllers: [AppController],
  // providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Makes configuration available globally
      // envFilePath: '.env',  // Path to your .env file
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    CitiesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
