
class A { }
/**
 * Usado para mapear o nome do campo no banco para a propriedade na model
 */
export type DbField = {
  modelKey: string,
  dbRow: string
};

export type DbRow = { [dbField: string]: any }

export abstract class DbRowMapper<T> {
  /**
   * Retorna definição da relação entre o nome da chave no objeto `T`
   * e o nome do campo no banco de dados.
   * 
   * Exemplo: 
   * ```
   * return [{
   *   modelKey: 'dateCreated',
   *   dbRow: 'date_created'
   * },{
   *   modelKey: 'dateUpdated',
   *   dbRow: 'date_updated'
   * }]
   * ```
   */
  abstract getFields(): DbField[];

  /**
   * Transforma uma linha da tabela em um objeto
   * @param row Linha da tabela do banco de dados
   */
  mapDbRowToModel = (row: any): T => {
    const obj: any = {};

    this.getFields().forEach((field) => {
      obj[field.modelKey] = row[field.dbRow];
    });

    return obj;
  }

  /**
   * Mapeia os valores do objeto para suas
   * respectivas colunas no banco de dados.
   * @param obj
   */
  mapObjectToDbRow = (obj: any): DbRow => {
    const fields: any = {};

    Object.keys(obj).forEach((key) => {
      const field = this.getFields().find(f => f.modelKey === key);

      if (field) {
        fields[field.dbRow] = obj[key];
      }
    });

    return fields;
  }
}
