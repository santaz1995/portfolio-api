import { EntityRepository, getManager, SelectQueryBuilder } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';
import { TypeOrmCommandRepository } from '../../../../../../common/database/type-orm/type-orm.command.repository';
import { ProjectImageCommandRepository } from '../../domain/project-image.command.repository';
import { ProjectImage } from '../../domain/project-image';

@EntityRepository()
export class TypeOrmProjectImageCommandRepository extends TypeOrmCommandRepository implements ProjectImageCommandRepository {

    constructor() {
        super(getManager());
    }

    /**
     * @param {number} id
     * @returns {Promise<ProjectImage>}
     */
    public async byId(id: number): Promise<ProjectImage> {
        return this.createQueryBuilder().andWhere('pi.id = :id').setParameter('id', id).getOne();
    }

    /**
     * @param {ProjectImage} projectImage
     * @returns {Promise<ProjectImage>}
     */
    public async store(projectImage: ProjectImage): Promise<ProjectImage> {
        return this.entityManager.save(projectImage);
    }

    /**
     * @param {ObjectType<any>} entityClass
     * @param {string} alias
     *
     * @returns {SelectQueryBuilder<any>}
     */
    protected createQueryBuilder(entityClass: ObjectType<any> = ProjectImage, alias: string = 'pi'): SelectQueryBuilder<any> {

        return this.entityManager.createQueryBuilder(entityClass, alias)
            .select(alias)
            .where(alias + '.deletedAt IS NULL');
    }
}