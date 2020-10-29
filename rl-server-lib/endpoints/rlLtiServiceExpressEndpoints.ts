// eslint-disable-next-line node/no-extraneous-import
import { Express } from "express";
import { NamesAndRoles } from "../services/namesAndRolesService";
import { Grade } from "../services/assignmentAndGradeService";
import { DeepLinking } from "../services/DeepLinking";
import { getToolConsumerByNameFromList } from "../services/ToolConsumerService";

import requestLogger from "../middleware/requestLogger";

import getDeepLinkItems from "../util/getDeepLinkItems";
import { createAssignment } from "../services/AssignmentService";
import Assignment from "../database/entities/Assignment";
import ToolConsumer from "../database/entities/ToolConsumer";

import {
  APPLICATION_URL,
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  ROSTER_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  GET_ASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES,
  LTI_ASSIGNMENT_REDIRECT,
  GET_JWKS_ENDPOINT
}  from "../../rl-shared/util/environment";

import {
  logger
}  from "../../rl-shared/util/LogService";


// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client
const rlLtiServiceExpressEndpoints = (app: Express): void => {
  app.get(ROSTER_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const results = await new NamesAndRoles().getMembers(platform, {
      role: req.query.role
    });
    await req.session.save(() => {
      logger.debug("session data saved");
    });
    res.send(results);
  });

  app.post(CREATE_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    logger.debug(
      "CREATE_ASSIGNMENT_ENDPOINT" + JSON.stringify(CREATE_ASSIGNMENT_ENDPOINT)
    );

    logger.debug(
      `CREATE_ASSIGNMENT_ENDPOINT session: ${JSON.stringify(req.session)}`
    );
    const platform: any = req.session.platform;
    const reqQueryString = req.body.params;

    //external_tool_url - Tool needs to pass this URL that will be launched when student
    //clicks on the assignment.
    //resourceId - this id is passed from platform to the tool so that the tool can
    //identify the correct content that needs to be displayed

    if (reqQueryString) {
      logger.debug(
        "Create Assignment - reqQueryString" + JSON.stringify(reqQueryString)
      );

      const assignment: Assignment = new Assignment();
      assignment.url = `${APPLICATION_URL}${LTI_ASSIGNMENT_REDIRECT.substring(
        1
      )}?resourceId=${reqQueryString.resourceId}`;
      assignment.title = reqQueryString.label;
      assignment.resource_id = reqQueryString.resourceId;
      assignment.lineitem_label = reqQueryString.label;
      assignment.lineitem_resource_id = reqQueryString.resourceId;
      assignment.lineitem_tag = reqQueryString.tag;
      assignment.lineitem_score_maximum = reqQueryString.scoreMaximum;
      assignment.type = "ltiResourceLink";
      assignment.lineitems = platform.lineitems;
      assignment.context_id = platform.context_id;
      const results = createAssignment(assignment);
      logger.debug(
        "Create Assignment - send results-" + JSON.stringify(results)
      );
      res.send(results);
    }
  });

  app.get(GET_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    logger.debug(`get assignments - platform - ${JSON.stringify(platform)}`);

    const results = await new Grade().getLineItems(platform);
    logger.debug(`Get assignments - send results - ${JSON.stringify(results)}`);
    res.send(results);
  });

  app.get(GET_UNASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const studentsNotAssignedToThisAssignments = [];
    const reqQueryString: any = req.query;
    if (reqQueryString && reqQueryString.lineItemId) {
      const platform: any = req.session.platform;

      const courseMembersCollection = await new NamesAndRoles().getMembers(
        platform,
        {
          role: "Learner"
        }
      );

      const members = courseMembersCollection.members;

      const assignmentMembersCollection = await new NamesAndRoles().getMembers(
        platform,
        {
          role: "Learner",
          resourceLinkId: reqQueryString.resourceLinkId
        }
      );
      const assignmentMembers = assignmentMembersCollection.members;

      for (const key in members) {
        const courseMember = members[key];
        logger.debug("courseMember -" + JSON.stringify(courseMember));
        logger.debug("assignmentMembers -" + JSON.stringify(assignmentMembers));
        const filteredData = assignmentMembers.filter(function (member: any) {
          logger.debug("member -" + JSON.stringify(member));
          return member.user_id == courseMember.user_id;
        });
        logger.debug("filteredData -" + JSON.stringify(filteredData));
        if (filteredData.length <= 0)
          studentsNotAssignedToThisAssignments.push({
            id: courseMember.user_id,
            name: courseMember.name,
            status: courseMember.status,
            picture: courseMember.picture,
            givenName: courseMember.given_name,
            familyName: courseMember.family_name
          });
      }
    }
    res.send(studentsNotAssignedToThisAssignments);
  });

  app.get(GET_ASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const assignedStudents = [];
    const reqQueryString: any = req.query;
    if (reqQueryString && reqQueryString.lineItemId) {
      const platform: any = req.session.platform;

      const assignmentMembersCollection = await new NamesAndRoles().getMembers(
        platform,
        {
          role: "Learner",
          resourceLinkId: reqQueryString.resourceLinkId
        }
      );
      const assignmentMembers: [any] = assignmentMembersCollection.members;

      for (const key in assignmentMembers) {
        const assignmentMember = assignmentMembers[key];
        assignedStudents.push({
          id: assignmentMember.user_id,
          name: assignmentMember.name,
          status: assignmentMember.status,
          picture: assignmentMember.picture,
          givenName: assignmentMember.given_name,
          familyName: assignmentMember.family_name
        });
      }
    }
    res.send(assignedStudents);
  });

  app.post(PUT_STUDENT_GRADE_VIEW, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const sessionObject = req.session;
    const platform: any = sessionObject.platform;
    const score = req.body.params;

    const results = await new Grade().putGrade(
      platform,
      {
        scoreGiven: score.grade,
        comment: score.comment,
        activityProgress: score.activityProgress,
        gradingProgress: score.gradingProgress
      },
      {
        id: platform.lineitem,
        userId: platform.userId,
        title: platform.lineitem || sessionObject.title || null
        //if platform.lineitem is null then it means that the SSO was not performed hence we
        //will fetch line item id by matching the assignment title.
      }
    );

    res.send(results);
  });

  app.get(DEEP_LINK_RESOURCELINKS_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error(
        `${DEEP_LINK_RESOURCELINKS_ENDPOINT}: no session detected, something is wrong`
      );
    }
    const platform: any = req.session.platform;
    const items = await getDeepLinkItems(
      DEEP_LINK_RESOURCELINKS_ENDPOINT,
      platform
    );
    logger.debug("deeplink - resource-link-items - " + JSON.stringify(items));

    return res.send(items);
  });

  app.post(DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error(
        `${DEEP_LINK_ASSIGNMENT_ENDPOINT}: no session detected, something is wrong`
      );
    }
    const platform: any = req.session.platform;
    const contentItems = req.body.contentItems;
    logger.debug("deeplink - platform - " + JSON.stringify(platform));
    logger.debug("deeplink - contentItems - " + JSON.stringify(contentItems));

    // Creates the deep linking request form
    const form = await new DeepLinking().createDeepLinkingForm(
      platform,
      contentItems,
      {
        message: "Successfully registered resource!"
      }
    );

    return res.send(form);
  });

  app.post(PUT_STUDENT_GRADE, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const sessionObject = req.session;
    const platform: any = req.session.platform;
    const score = req.body.params;

    const results = await new Grade().putGrade(
      platform,
      {
        timestamp: new Date().toISOString(),
        scoreGiven: score.grade,
        comment: score.comment,
        activityProgress: score.activityProgress,
        gradingProgress: score.gradingProgress
      },
      {
        id: score.lineItemId || platform.lineitem,
        userId: score.userId,
        title: platform.lineitem || sessionObject.title || null
        //if platform.lineitem is null then it means that the SSO was not performed hence we
        //will fetch line item id by matching the assignment title.
      }
    );

    res.send(results);
  });

  app.delete(DELETE_LINE_ITEM, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    const lineItemId: any = req.query.lineItemId;
    if (lineItemId) {
      const results = await new Grade().deleteLineItems(platform, {
        id: lineItemId
      });

      res.send(results);
    }
  });

  app.get(GET_GRADES, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }

    const scoreData = [];
    const platform: any = req.session.platform;
    const reqQueryString: any = req.query;
    if (reqQueryString && reqQueryString.lineItemId) {
      const results: any = ([] = await new Grade().getGrades(platform, {
        id: reqQueryString.lineItemId,
        resourceLinkId: false
      }));
      logger.debug(
        " results[0].results - " + JSON.stringify(results[0].results)
      );

      const membersCollection = await new NamesAndRoles().getMembers(platform, {
        role: "Learner"
      });
      logger.debug(
        "Get Grades - members - " + JSON.stringify(membersCollection)
      );
      if (results.length <= 0) return res.send([]);
      for (const key in results[0].results) {
        const score = results[0].results[key];
        //Grades service call will only return user Id along with the score
        //so for this demo, we are retrieving the user info from the session
        //so that we can display name of the student
        //In production env, we can call the Name and Role service and get the user details from there
        const tooltipsData = membersCollection.members.filter(function (
          member: any
        ) {
          return member.user_id == score.userId;
        });

        scoreData.push({
          userId: score.userId,
          StudenName: tooltipsData[0].name,
          score: score.resultScore,
          comment: score.comment
        });
      }
      logger.debug("scoreData - " + scoreData);
    }
    res.send(scoreData);
  });

  app.get(GET_JWKS_ENDPOINT, requestLogger, async (req, res) => {
    const reqQueryString: any = req.query;
    const consumerTool: ToolConsumer | undefined = getToolConsumerByNameFromList(reqQueryString.name);
    res.send(consumerTool);
  });
};

export default rlLtiServiceExpressEndpoints;
