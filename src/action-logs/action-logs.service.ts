import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionLog } from 'src/entities/action-log.entity';
import { Repository } from 'typeorm';
import { CreateActionLogDto } from './dto/create-action-log.dto';

@Injectable()
export class ActionLogsService {
  constructor(
    @InjectRepository(ActionLog)
    private readonly actionLogsRepository: Repository<ActionLog>,
  ) {}

  /////////////////////////////// GET All Action Logs ///////////////////////////////
  async getAllActionLogs() {
    const actionLogs = await this.actionLogsRepository.find({
      order: { id: 'DESC' },
      relations: ['user'], // This tells TypeORM to load the related 'user' entity
    });

    const actionLogsFiltered = actionLogs.map((log) => {
      return {
        id: log.id,
        action: log.action,
        description: log.description,
        createdAt: log.createdAt,
        userId: log.user ? log.user.id : null,
      };
    });

    return actionLogsFiltered;
  }

  /////////////////////////////// GET Specific User Action Logs ///////////////////////////////
  async getUserActionLogs(userId: number) {
    const actionLogs = await this.actionLogsRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' }, // Get latest logs first.
      relations: ['user'],
    });

    const actionLogsFiltered = actionLogs.map((log) => {
      return {
        id: log.id,
        action: log.action,
        description: log.description,
        createdAt: log.createdAt,
        userId: log.user ? log.user.id : null,
      };
    });

    if (actionLogsFiltered.length === 0) {
      throw new NotFoundException(
        `No action logs found for user with id ${userId}`,
      );
    }

    return actionLogsFiltered;
  }

  /////////////////////////////// CREATE Action Log ///////////////////////////////
  async createActionLog(createActionLogDto: CreateActionLogDto) {
    const actionLog = this.actionLogsRepository.create(createActionLogDto);
    await this.actionLogsRepository.save(actionLog);

    return {
      id: actionLog.id,
      action: actionLog.action,
      description: actionLog.description,
      createdAt: actionLog.createdAt,
      userId: actionLog.user ? actionLog.user.id : null,
    };
  }
}
