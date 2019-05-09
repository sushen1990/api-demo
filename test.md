#学生管理者查看该学生的家长列表
  /student/open/admin/list:
    x-swagger-route-controller: student
    post:
      tags:
        - "student 学生"
      summary: 学生管理者查看该学生的家长列表
      operationId: open_student_adminList
      parameters:
        - name: body
          in: body
          description: 传值
          required: true
          schema:
            required:
              - studentId
              - userId
            properties:
              studentId:
                type: string
                description: 学生id
              userId:
                type: string
                description: 当前登录人id
      responses:
        "200":
          description: 成功
          schema:
            properties:
              status:
                type: boolean
                description: 状态
              resources:
                type: object
                description: 返回值
        default:
          description: 失败
          schema:
            $ref: "#/definitions/ErrorResponse"